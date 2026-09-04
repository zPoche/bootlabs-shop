import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
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
  const build_order = await operations.advanceBuildOrder(req.params.id, state)
  res.json({ build_order })
}
