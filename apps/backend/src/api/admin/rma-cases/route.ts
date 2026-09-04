import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OPERATIONS_MODULE } from "../../../modules/operations"
import type OperationsModuleService from "../../../modules/operations/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const operations: OperationsModuleService = req.scope.resolve(OPERATIONS_MODULE)
  const rma_cases = await operations.listRmaCases({}, { take: 100 })
  res.json({ rma_cases })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const operations: OperationsModuleService = req.scope.resolve(OPERATIONS_MODULE)
  const rma_case = await operations.createRmaCases(
    req.body as {
      device_id: string
      type: string
      reported_issue: string
      customer_id?: string | null
    }
  )
  res.status(201).json({ rma_case })
}
