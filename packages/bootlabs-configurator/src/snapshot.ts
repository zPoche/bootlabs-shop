import {
  CONFIGURATION_TTL_DAYS,
  DEFAULT_BUILD_TIME_DAYS,
  componentsByIds,
  toComponentRef,
} from "./catalog"
import { evaluateCompatibility } from "./engine"
import { assertServerAuthoritative, calculateAuthoritativePrice } from "./pricing"
import type { ComponentRecord, ConfigurationSnapshot } from "./types"

export function publicReference(): string {
  const stamp = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `BL-${stamp}-${rand}`
}

export function buildSnapshot(input: {
  id: string
  records: ComponentRecord[]
  createdAt?: Date
}): ConfigurationSnapshot {
  const createdAt = input.createdAt ?? new Date()
  const expires = new Date(createdAt)
  expires.setDate(expires.getDate() + CONFIGURATION_TTL_DAYS)

  const selected = input.records.map(toComponentRef)
  const compatibility = evaluateCompatibility(selected)
  const price = calculateAuthoritativePrice(input.records)
  assertServerAuthoritative(price)

  return {
    id: input.id,
    publicReference: publicReference(),
    selectedComponents: selected,
    calculatedPriceCents: price.totalCents,
    estimatedPowerWatt: compatibility.estimatedPowerWatt,
    estimatedBuildTimeDays: DEFAULT_BUILD_TIME_DAYS,
    compatibility,
    price,
    createdAt: createdAt.toISOString(),
    expiresAt: expires.toISOString(),
  }
}

export function snapshotFromIds(id: string, componentIds: string[]): ConfigurationSnapshot {
  return buildSnapshot({
    id,
    records: componentsByIds(componentIds),
  })
}
