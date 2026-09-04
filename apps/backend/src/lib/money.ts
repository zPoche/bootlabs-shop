/** Bootlabs stores money in cents. Medusa v2 prices use major currency units. */
export function medusaAmountFromCents(cents: number): number {
  return Number((cents / 100).toFixed(2))
}

export function centsFromMedusaAmount(amount: number): number {
  return Math.round(amount * 100)
}
