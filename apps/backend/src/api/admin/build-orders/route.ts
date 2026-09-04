import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OPERATIONS_MODULE } from "../../../modules/operations"
import type OperationsModuleService from "../../../modules/operations/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const operations: OperationsModuleService = req.scope.resolve(OPERATIONS_MODULE)
  const build_orders = await operations.listBuildOrders(
    {},
    { take: 100, order: { created_at: "DESC" } }
  )
  res.json({ build_orders })
}
