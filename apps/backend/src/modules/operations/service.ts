import { MedusaService } from "@medusajs/framework/utils"
import BuildOrder from "./models/build-order"
import RmaCase from "./models/rma-case"

export type BuildOrderState =
  | "queued"
  | "parts_reserved"
  | "assembling"
  | "qc"
  | "burn_in"
  | "ready_to_ship"
  | "shipped"

const STATES: BuildOrderState[] = [
  "queued",
  "parts_reserved",
  "assembling",
  "qc",
  "burn_in",
  "ready_to_ship",
  "shipped",
]

class OperationsModuleService extends MedusaService({
  BuildOrder,
  RmaCase,
}) {
  async advanceBuildOrder(id: string, state: BuildOrderState) {
    if (!STATES.includes(state)) {
      throw new Error(`Ungültiger Build-Status: ${state}`)
    }

    const patch: Record<string, unknown> = { id, state }
    if (state === "burn_in") {
      patch.burn_in_started_at = new Date()
    }
    if (state === "ready_to_ship") {
      patch.burn_in_completed_at = new Date()
      patch.shipping_ready_at = new Date()
    }
    if (state === "parts_reserved") {
      patch.component_reservation_status = "reserved"
    }

    return this.updateBuildOrders(patch)
  }
}

export default OperationsModuleService
