import { stripePaymentProviderIds } from "../payment-providers"

describe("stripe payment providers", () => {
  const original = process.env.STRIPE_SECRET_KEY

  afterEach(() => {
    if (original === undefined) {
      delete process.env.STRIPE_SECRET_KEY
    } else {
      process.env.STRIPE_SECRET_KEY = original
    }
  })

  it("always keeps the manual provider", () => {
    delete process.env.STRIPE_SECRET_KEY
    expect(stripePaymentProviderIds()).toEqual(["pp_system_default"])
  })

  it("adds Stripe when a secret key is set", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_dummy"
    expect(stripePaymentProviderIds()).toEqual([
      "pp_system_default",
      "pp_stripe_stripe",
    ])
  })
})
