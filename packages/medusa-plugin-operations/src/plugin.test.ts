import { describe, expect, it } from "vitest"
import { pluginStatus } from "./index"

describe("operations plugin skeleton", () => {
  it("registers BuildOrder for phase 1", () => {
    expect(pluginStatus.registeredInMedusa).toBe(true)
    expect(pluginStatus.phase).toBe(1)
    expect(pluginStatus.plannedEntities).toContain("BuildOrder")
  })
})
