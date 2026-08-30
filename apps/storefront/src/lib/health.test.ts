import { describe, expect, it } from "vitest"
import { getStorefrontHealth } from "./health"

describe("storefront health", () => {
  it("reports phase 0", () => {
    const health = getStorefrontHealth()
    expect(health.ok).toBe(true)
    expect(health.service).toBe("bootlabs-storefront")
    expect(health.phase).toBe(0)
  })
})
