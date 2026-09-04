import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DEVICES_MODULE } from "../../../../../modules/devices"
import type DevicesModuleService from "../../../../../modules/devices/service"
import { OPERATIONS_MODULE } from "../../../../../modules/operations"
import type OperationsModuleService from "../../../../../modules/operations/service"
import type { BuildOrderState } from "../../../../../modules/operations/service"

export async function POST(
  req: MedusaRequest<{ state?: BuildOrderState }>,
  res: MedusaResponse
) {
  const state = req.body?.state
  if (!state) {
    res.status(400).json({ message: "state fehlt." })
    return
  }

  const operations: OperationsModuleService = req.scope.resolve(OPERATIONS_MODULE)
  const updated = await operations.advanceBuildOrder(req.params.id, state)
  const build_order = Array.isArray(updated) ? updated[0] : updated

  if (state === "shipped") {
    const devices: DevicesModuleService = req.scope.resolve(DEVICES_MODULE)
    const existing = await devices.listDevices({ order_id: build_order.order_id })
    if (existing.length === 0) {
      const suffix = String(build_order.order_id).slice(-8).toUpperCase()
      await devices.createDevices({
        asset_tag: `BL-${suffix}`,
        serial_number: `SN-PENDING-${suffix}`,
        status: "active",
        configuration_id: build_order.configuration_id,
        order_id: build_order.order_id,
        device_condition: "new",
        qc_status: "passed",
      })
    }
  }

  res.json({ build_order })
}
