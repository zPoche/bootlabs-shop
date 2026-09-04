import { centsFromMedusaAmount, medusaAmountFromCents } from "../money"

describe("money units", () => {
  it("converts cents to Medusa major units", () => {
    expect(medusaAmountFromCents(129900)).toBe(1299)
    expect(medusaAmountFromCents(89900)).toBe(899)
    expect(medusaAmountFromCents(3900)).toBe(39)
  })

  it("round-trips amounts", () => {
    expect(centsFromMedusaAmount(medusaAmountFromCents(179900))).toBe(179900)
  })
})
