import type { CompatibilityResult, ComponentRef } from "./types"

/**
 * Compatibility evaluation is server-authoritative in Phase 2.
 * Phase 0 only reserves the contract so storefront and plugins share types.
 */
export function evaluateCompatibility(
  _selected: ComponentRef[]
): CompatibilityResult {
  return {
    ok: true,
    engine: "planned",
    issues: [],
  }
}
