export function stripePaymentProviderIds() {
  const providers = ["pp_system_default"]
  if (process.env.STRIPE_SECRET_KEY) {
    providers.push("pp_stripe_stripe")
  }
  return providers
}
