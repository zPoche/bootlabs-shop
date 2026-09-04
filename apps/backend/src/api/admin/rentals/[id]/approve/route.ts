import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createRentalCheckoutSession } from "../../../../../lib/stripe-billing"
import { RENTAL_MODULE } from "../../../../../modules/rental"
import type RentalModuleService from "../../../../../modules/rental/service"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const rental: RentalModuleService = req.scope.resolve(RENTAL_MODULE)
  const contract = await rental.retrieveRentalContract(req.params.id)
  const storefront =
    process.env.STOREFRONT_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:8000"

  let checkoutUrl: string | null = null
  let stripeCustomerId = contract.stripe_customer_id
  let stripeSubscriptionId = contract.stripe_subscription_id

  if (process.env.STRIPE_SECRET_KEY) {
    const session = await createRentalCheckoutSession({
      contractId: contract.id,
      monthlyRateCents: contract.monthly_rate_cents,
      depositCents: contract.deposit_cents,
      successUrl: `${storefront}/de/account?rental=ok`,
      cancelUrl: `${storefront}/de/gaming-pcs?rental=cancel`,
    })
    checkoutUrl = session.url
    stripeCustomerId =
      typeof session.customer === "string" ? session.customer : stripeCustomerId
    stripeSubscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : stripeSubscriptionId
  }

  const updated = await rental.approve(contract.id, {
    status: "approved",
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: stripeSubscriptionId,
    notes: [contract.notes, checkoutUrl ? `checkout:${checkoutUrl}` : null]
      .filter(Boolean)
      .join("\n"),
  })

  res.json({ rental: updated, checkout_url: checkoutUrl })
}
