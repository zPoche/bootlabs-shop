import { describe, expect, it } from "vitest"
import {
  COMPONENT_CATALOG,
  SYSTEM_PRESETS,
  componentsByIds,
  toComponentRef,
} from "./catalog"
import { evaluateCompatibility } from "./engine"
import {
  assertServerAuthoritative,
  calculateAuthoritativePrice,
  estimatePricePreview,
} from "./pricing"
import { RULE_CATALOG, listPlannedRuleIds } from "./rules"
import { snapshotFromIds } from "./snapshot"

const refs = (...ids: string[]) => componentsByIds(ids).map(toComponentRef)

describe("rule catalog", () => {
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

describe("compatibility engine", () => {
  it("accepts every shipped system preset", () => {
    for (const system of SYSTEM_PRESETS) {
      const result = evaluateCompatibility(refs(...system.componentIds))
      expect(result.engine).toBe("active")
      expect(result.ok).toBe(true)
    }
  })

  it("blocks mismatched CPU socket", () => {
    const result = evaluateCompatibility(
      refs("cpu-i5-14400", "mb-b650", "ram-32-6000")
    )
    expect(result.ok).toBe(false)
    expect(result.issues.some((issue) => issue.ruleId === "cpu-socket-mainboard")).toBe(
      true
    )
  })

  it("blocks DDR4 on a DDR5 board", () => {
    const result = evaluateCompatibility(refs("mb-b650", "ram-32-3200"))
    expect(result.ok).toBe(false)
    expect(
      result.issues.some((issue) => issue.ruleId === "ram-generation-mainboard")
    ).toBe(true)
  })

  it("blocks a long GPU in a compact case", () => {
    const result = evaluateCompatibility(refs("gpu-5080", "case-compact"))
    expect(result.ok).toBe(false)
    expect(result.issues.some((issue) => issue.ruleId === "gpu-dimensions-case")).toBe(
      true
    )
  })

  it("blocks a 360 radiator in a compact case", () => {
    const result = evaluateCompatibility(refs("cooler-aio-360", "case-compact"))
    expect(result.ok).toBe(false)
    expect(
      result.issues.some((issue) => issue.ruleId === "cooler-dimensions-case")
    ).toBe(true)
  })

  it("blocks a 12VHPWR GPU on a PSU without the connector", () => {
    const result = evaluateCompatibility(refs("gpu-5080", "psu-650", "mb-b650"))
    expect(result.ok).toBe(false)
    expect(result.issues.some((issue) => issue.ruleId === "pcie-12vhpwr")).toBe(true)
  })

  it("warns when the cooler TDP is too low", () => {
    const result = evaluateCompatibility([
      ...refs("cpu-r7-9800x3d"),
      {
        id: "cooler-weak",
        type: "cooler",
        specifications: { coolerType: "air", heightMm: 140, tdpWatts: 80 },
      },
    ])
    expect(
      result.issues.some(
        (issue) => issue.ruleId === "cpu-cooler-tdp" && issue.severity === "warning"
      )
    ).toBe(true)
    expect(result.ok).toBe(true)
  })

  it("warns when BIOS may need an update", () => {
    const result = evaluateCompatibility(refs("cpu-r7-9800x3d", "mb-b650"))
    expect(
      result.issues.some(
        (issue) =>
          issue.ruleId === "bios-compatibility" && issue.severity === "warning"
      )
    ).toBe(true)
  })
})

describe("pricing", () => {
  it("marks client estimates as non-authoritative", () => {
    const preview = estimatePricePreview([])
    expect(preview.authoritative).toBe(false)
    expect(() => assertServerAuthoritative(preview)).toThrow(/not authoritative/)
  })

  it("computes server prices with margin and tax", () => {
    const cpu = COMPONENT_CATALOG.find((item) => item.id === "cpu-r5-7600")!
    const price = calculateAuthoritativePrice([cpu])
    expect(price.authoritative).toBe(true)
    expect(price.componentsCents).toBe(14900)
    expect(price.marginCents).toBe(Math.round((14900 * 18) / 100))
    expect(price.totalCents).toBeGreaterThan(price.componentsCents)
  })
})

describe("snapshots", () => {
  it("builds an authoritative snapshot for PLAY 1080", () => {
    const snapshot = snapshotFromIds("cfg_test", SYSTEM_PRESETS[0]!.componentIds)
    expect(snapshot.compatibility.ok).toBe(true)
    expect(snapshot.price.authoritative).toBe(true)
    expect(snapshot.calculatedPriceCents).toBeGreaterThan(0)
    expect(snapshot.publicReference.startsWith("BL-")).toBe(true)
  })
})
