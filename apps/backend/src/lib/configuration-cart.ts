import { MedusaError } from "@medusajs/framework/utils"

export type CartLikeItem = {
  metadata?: Record<string, unknown> | null
  unit_price?: number | string | null
}

export function configurationIdFromMetadata(
  metadata?: Record<string, unknown> | null
): string | null {
  const value = metadata?.configuration_id
  return typeof value === "string" && value.length > 0 ? value : null
}

export function configurationIdsFromItems(items: CartLikeItem[] = []): string[] {
  return [
    ...new Set(
      items
        .map((item) => configurationIdFromMetadata(item.metadata))
        .filter((value): value is string => Boolean(value))
    ),
  ]
}

export function assertConfigurationReady(input: {
  ok: boolean
  publicReference?: string
  message?: string
}) {
  if (!input.ok) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      input.message ??
        `Konfiguration ${input.publicReference ?? ""} ist nicht kaufbar.`
    )
  }
}
