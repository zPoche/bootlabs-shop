import { MedusaService } from "@medusajs/framework/utils"
import RentalContract from "./models/rental-contract"
import RentalEvent from "./models/rental-event"

class RentalModuleService extends MedusaService({
  RentalContract,
  RentalEvent,
}) {
  async requestContract(input: {
    customer_id?: string | null
    configuration_id?: string | null
    monthly_rate_cents: number
    deposit_cents?: number
    notes?: string | null
  }) {
    const contract = await this.createRentalContracts({
      customer_id: input.customer_id ?? null,
      configuration_id: input.configuration_id ?? null,
      monthly_rate_cents: input.monthly_rate_cents,
      deposit_cents: input.deposit_cents ?? 0,
      status: "pending_review",
      notes: input.notes ?? null,
    })

    await this.createRentalEvents({
      rental_contract_id: contract.id,
      type: "contract_signed",
      actor: input.customer_id ?? "storefront",
      payload: { source: "store_request" },
    })

    return contract
  }
}

export default RentalModuleService
