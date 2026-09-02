import { describe, expect, it } from "vitest"
import { pluginStatus, assertRentalNotImplemented } from "./index"

describe("rental plugin extension point", () => {
  it("is documented and not implemented", () => {
    expect(pluginStatus.implemented).toBe(false)
    expect(pluginStatus.registeredInMedusa).toBe(false)
    expect(pluginStatus.phase).toBe(4)
    expect(() => assertRentalNotImplemented()).toThrow(/extension point only/)
  })
})
