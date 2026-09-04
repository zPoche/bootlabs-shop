import { describe, expect, it } from "vitest"
import { pluginStatus } from "./index"

describe("rental plugin", () => {
  it("is registered for shop rental requests", () => {
    expect(pluginStatus.implemented).toBe(true)
    expect(pluginStatus.registeredInMedusa).toBe(true)
    expect(pluginStatus.phase).toBe(4)
  })
})
