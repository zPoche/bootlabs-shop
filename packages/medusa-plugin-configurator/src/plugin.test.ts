import { describe, expect, it } from "vitest"
import { pluginStatus } from "./index"

describe("configurator plugin skeleton", () => {
  it("is registered for phase 2", () => {
    expect(pluginStatus.registeredInMedusa).toBe(true)
    expect(pluginStatus.phase).toBe(2)
    expect(pluginStatus.plannedRuleCount).toBe(8)
  })
})
