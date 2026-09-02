import { describe, expect, it } from "vitest"
import { pluginStatus } from "./index"

describe("devices plugin skeleton", () => {
  it("is reserved for phase 3", () => {
    expect(pluginStatus.registeredInMedusa).toBe(false)
    expect(pluginStatus.phase).toBe(3)
    expect(pluginStatus.plannedEntities).toContain("Device")
  })
})
