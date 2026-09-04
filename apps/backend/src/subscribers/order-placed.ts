import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { OPERATIONS_MODULE } from "../modules/operations"
import type OperationsModuleService from "../modules/operations/service"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; items?: Array<{ metadata?: Record<string, unknown> }> }>) {
  const operations: OperationsModuleService = container.resolve(OPERATIONS_MODULE)
  const existing = await operations.listBuildOrders({ order_id: data.id })
  if (existing.length > 0) {
    return
  }

  const configurationId =
    data.items
      ?.map((item) => item.metadata?.configuration_id)
      .find((value): value is string => typeof value === "string") ?? null

  await operations.createBuildOrders({
    order_id: data.id,
    configuration_id: configurationId,
    state: "queued",
    component_reservation_status: "pending",
    qc_checklist: {
      visual: false,
      boot: false,
      burn_in: false,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
