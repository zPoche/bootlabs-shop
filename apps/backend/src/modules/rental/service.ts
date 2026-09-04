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

  async approve(id: string, patch: {
    status?: string
    stripe_customer_id?: string | null
    stripe_subscription_id?: string | null
    stripe_price_id?: string | null
    notes?: string | null
    starts_at?: Date | null
  }) {
    return this.updateRentalContracts({
      id,
      status: patch.status ?? "approved",
      ...patch,
    })
  }

  async applyStripeEvent(input: {
    contractId: string
    type: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
  }) {
    const status =
      input.type === "invoice.paid" || input.type === "checkout.session.completed"
        ? input.type === "invoice.paid"
          ? "active"
          : "approved"
        : input.type === "invoice.payment_failed"
          ? "payment_failed"
          : input.type === "customer.subscription.deleted"
            ? "closed"
            : undefined

    const contract = await this.updateRentalContracts({
      id: input.contractId,
      ...(status ? { status } : {}),
      stripe_customer_id: input.stripeCustomerId ?? undefined,
      stripe_subscription_id: input.stripeSubscriptionId ?? undefined,
      stripe_price_id: input.stripePriceId ?? undefined,
      ...(status === "active" ? { starts_at: new Date() } : {}),
    })

    await this.createRentalEvents({
      rental_contract_id: input.contractId,
      type: input.type,
      actor: "stripe",
      payload: {
        stripe_subscription_id: input.stripeSubscriptionId ?? null,
      },
    })

    return contract
  }
}

export default RentalModuleService
