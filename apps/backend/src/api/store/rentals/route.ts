import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { RENTAL_MODULE } from "../../../modules/rental"
import type RentalModuleService from "../../../modules/rental/service"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = (req.body ?? {}) as {
    customer_id?: string
    configuration_id?: string
    monthly_rate_cents?: number
    deposit_cents?: number
    notes?: string
  }

  if (!body.monthly_rate_cents) {
    res.status(400).json({ message: "monthly_rate_cents fehlt." })
    return
  }

  const rental: RentalModuleService = req.scope.resolve(RENTAL_MODULE)
  const contract = await rental.requestContract({
    customer_id: body.customer_id ?? null,
    configuration_id: body.configuration_id ?? null,
    monthly_rate_cents: body.monthly_rate_cents,
    deposit_cents: body.deposit_cents ?? 0,
    notes: body.notes ?? null,
  })

  res.status(201).json({ rental: contract })
}
