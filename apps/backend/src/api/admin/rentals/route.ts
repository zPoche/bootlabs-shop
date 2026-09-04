import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { RENTAL_MODULE } from "../../../modules/rental"
import type RentalModuleService from "../../../modules/rental/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const rental: RentalModuleService = req.scope.resolve(RENTAL_MODULE)
  const rentals = await rental.listRentalContracts(
    {},
    { take: 100, order: { created_at: "DESC" } }
  )
  res.json({ rentals })
}
