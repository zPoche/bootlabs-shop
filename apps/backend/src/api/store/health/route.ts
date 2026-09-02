import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getPhase0Status } from "../../../lib/phase0"

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  res.status(200).json(getPhase0Status())
}
