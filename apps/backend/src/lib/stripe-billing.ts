import { MedusaError } from "@medusajs/framework/utils"

type StripeSession = {
  id: string
  url: string | null
  customer?: string | null
  subscription?: string | null
}

export async function createRentalCheckoutSession(input: {
  contractId: string
  monthlyRateCents: number
  depositCents?: number
  successUrl: string
  cancelUrl: string
}): Promise<StripeSession> {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "STRIPE_SECRET_KEY fehlt."
    )
  }

  const body = new URLSearchParams({
    mode: "subscription",
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    "metadata[rental_contract_id]": input.contractId,
    "subscription_data[metadata][rental_contract_id]": input.contractId,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(input.monthlyRateCents),
    "line_items[0][price_data][recurring][interval]": "month",
    "line_items[0][price_data][product_data][name]": `Bootlabs Miete ${input.contractId}`,
  })

  if (input.depositCents && input.depositCents > 0) {
    body.set("line_items[1][quantity]", "1")
    body.set("line_items[1][price_data][currency]", "eur")
    body.set("line_items[1][price_data][unit_amount]", String(input.depositCents))
    body.set(
      "line_items[1][price_data][product_data][name]",
      `Kaution ${input.contractId}`
    )
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })
  const payload = (await response.json()) as StripeSession & { error?: { message?: string } }
  if (!response.ok) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      payload.error?.message ?? "Stripe Checkout fehlgeschlagen."
    )
  }
  return payload
}

export function rentalIdFromStripeObject(object: {
  metadata?: Record<string, string> | null
  subscription?: { metadata?: Record<string, string> | null } | string | null
}): string | null {
  return (
    object.metadata?.rental_contract_id ??
    (typeof object.subscription === "object"
      ? object.subscription?.metadata?.rental_contract_id ?? null
      : null)
  )
}
