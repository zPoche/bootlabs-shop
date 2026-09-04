import type { ComponentRecord, ComponentRef, PriceBreakdown } from "./types"

function asRecord(item: ComponentRef | ComponentRecord): {
  purchasePriceCents?: number
  targetMarginPercent?: number
  taxRate?: number
} {
  return item as ComponentRecord
}

function lineAmounts(item: ComponentRef | ComponentRecord) {
  const record = asRecord(item)
  const purchase = record.purchasePriceCents ?? 0
  const marginPercent = record.targetMarginPercent ?? 0
  const taxRate = record.taxRate ?? 19
  const margin = Math.round((purchase * marginPercent) / 100)
  const net = purchase + margin
  const tax = Math.round((net * taxRate) / 100)
  return { purchase, margin, tax, total: net + tax }
}

export function calculateAuthoritativePrice(
  selected: Array<ComponentRef | ComponentRecord>
): PriceBreakdown {
  const totals = selected.reduce(
    (acc, item) => {
      const line = lineAmounts(item)
      acc.componentsCents += line.purchase
      acc.marginCents += line.margin
      acc.taxCents += line.tax
      acc.totalCents += line.total
      return acc
    },
    { componentsCents: 0, marginCents: 0, taxCents: 0, totalCents: 0 }
  )

  return {
    currency: "EUR",
    ...totals,
    authoritative: true,
  }
}

export function estimatePricePreview(
  selected: Array<ComponentRef | ComponentRecord>
): PriceBreakdown {
  const price = calculateAuthoritativePrice(selected)
  return { ...price, authoritative: false }
}

export function assertServerAuthoritative(breakdown: PriceBreakdown): void {
  if (!breakdown.authoritative) {
    throw new Error(
      "Price is not authoritative. Recalculate on the Bootlabs server before checkout."
    )
  }
}

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100)
}
