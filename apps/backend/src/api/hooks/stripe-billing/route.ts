import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { rentalIdFromStripeObject } from "../../../lib/stripe-billing"
import { verifyStripeSignature } from "../../../lib/stripe-signature"
import { RENTAL_MODULE } from "../../../modules/rental"
import type RentalModuleService from "../../../modules/rental/service"

type StripeEvent = {
  type?: string
  data?: {
    object?: {
      metadata?: Record<string, string> | null
      customer?: string | null
      subscription?: string | { id?: string; metadata?: Record<string, string> | null } | null
      id?: string
    }
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const secret =
    process.env.STRIPE_BILLING_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET
  const raw =
    typeof req.rawBody === "string"
      ? req.rawBody
      : JSON.stringify(req.body ?? {})

  if (secret) {
    const header =
      (req.headers["stripe-signature"] as string | undefined) ??
      (req.get?.("stripe-signature") as string | undefined)
    if (!verifyStripeSignature({ payload: raw, header, secret })) {
      res.status(400).json({ message: "Ungültige Stripe-Signatur." })
      return
    }
  }

  const event = (req.body ?? {}) as StripeEvent
  const object = event.data?.object
  const contractId = object ? rentalIdFromStripeObject(object) : null
  if (!contractId || !event.type) {
    res.json({ ignored: true })
    return
  }

  const rental: RentalModuleService = req.scope.resolve(RENTAL_MODULE)
  const subscription =
    typeof object?.subscription === "string"
      ? object.subscription
      : object?.subscription?.id ?? (event.type.startsWith("customer.subscription") ? object?.id : null)

  await rental.applyStripeEvent({
    contractId,
    type: event.type,
    stripeCustomerId: object?.customer ?? null,
    stripeSubscriptionId: subscription ?? null,
  })

  res.json({ ok: true })
}
