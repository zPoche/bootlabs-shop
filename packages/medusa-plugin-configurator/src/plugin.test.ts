import { describe, expect, it } from "vitest"
import { pluginStatus } from "./index"

describe("configurator plugin skeleton", () => {
  it("is reserved for phase 2 and not registered yet", () => {
    expect(pluginStatus.registeredInMedusa).toBe(false)
    expect(pluginStatus.phase).toBe(2)
    expect(pluginStatus.plannedRuleCount).toBe(8)
  })
})
