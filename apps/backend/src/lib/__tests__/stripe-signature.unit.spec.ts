import { createHmac } from "crypto"
import { verifyStripeSignature } from "../stripe-signature"

describe("stripe signature", () => {
  it("accepts a matching Stripe-Signature header", () => {
    const payload = '{"id":"evt_1"}'
    const secret = "whsec_test"
    const timestamp = String(Math.floor(Date.now() / 1000))
    const signature = createHmac("sha256", secret)
      .update(`${timestamp}.${payload}`)
      .digest("hex")

    expect(
      verifyStripeSignature({
        payload,
        header: `t=${timestamp},v1=${signature}`,
        secret,
      })
    ).toBe(true)
  })

  it("rejects a missing or wrong signature", () => {
    expect(
      verifyStripeSignature({
        payload: "{}",
        header: undefined,
        secret: "whsec_test",
      })
    ).toBe(false)
    expect(
      verifyStripeSignature({
        payload: "{}",
        header: "t=1,v1=deadbeef",
        secret: "whsec_test",
      })
    ).toBe(false)
  })
})
