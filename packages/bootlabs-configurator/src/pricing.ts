import type { ComponentRef, PriceBreakdown } from "./types"

/**
 * Browser-side numbers are never authoritative.
 * Phase 2 will compute purchase price and margin on the server only.
 */
export function estimatePricePreview(
  _selected: ComponentRef[]
): PriceBreakdown {
  return {
    currency: "EUR",
    componentsCents: 0,
    marginCents: 0,
    totalCents: 0,
    authoritative: false,
  }
}

export function assertServerAuthoritative(breakdown: PriceBreakdown): void {
  if (!breakdown.authoritative) {
    throw new Error(
      "Price is not authoritative. Recalculate on the Bootlabs server before checkout."
    )
  }
}
