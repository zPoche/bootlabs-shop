import { describe, expect, it } from "vitest"
import { pluginStatus } from "./index"

describe("devices plugin skeleton", () => {
  it("is registered for phase 3", () => {
    expect(pluginStatus.registeredInMedusa).toBe(true)
    expect(pluginStatus.phase).toBe(3)
    expect(pluginStatus.plannedEntities).toContain("Device")
  })
})
