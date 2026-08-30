import { describe, expect, it } from "vitest"
import { evaluateCompatibility } from "./engine"
import { assertServerAuthoritative, estimatePricePreview } from "./pricing"
import { RULE_CATALOG, listPlannedRuleIds } from "./rules"

describe("phase 2 rule catalog", () => {
  it("lists every required compatibility rule", () => {
    expect(listPlannedRuleIds()).toEqual([
      "cpu-socket-mainboard",
      "ram-generation-mainboard",
      "gpu-dimensions-case",
      "cooler-dimensions-case",
      "psu-power-reserve",
      "pcie-12vhpwr",
      "cpu-cooler-tdp",
      "bios-compatibility",
    ])
    expect(RULE_CATALOG).toHaveLength(8)
  })
})

describe("compatibility engine (phase 0 stub)", () => {
  it("does not evaluate rules yet", () => {
    const result = evaluateCompatibility([])
    expect(result.engine).toBe("planned")
    expect(result.ok).toBe(true)
    expect(result.issues).toEqual([])
  })
})

describe("pricing contract", () => {
  it("marks client estimates as non-authoritative", () => {
    const preview = estimatePricePreview([])
    expect(preview.authoritative).toBe(false)
    expect(() => assertServerAuthoritative(preview)).toThrow(
      /not authoritative/
    )
  })
})
