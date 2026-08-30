import type { RuleId, RuleSeverity } from "./types"

export type PlannedRule = {
  id: RuleId
  severity: RuleSeverity
  summary: string
  phase: 2
}

export const RULE_CATALOG: readonly PlannedRule[] = [
  {
    id: "cpu-socket-mainboard",
    severity: "block",
    summary: "CPU-Sockel muss zum Mainboard passen.",
    phase: 2,
  },
  {
    id: "ram-generation-mainboard",
    severity: "block",
    summary: "RAM-Generation und Slots müssen zum Mainboard passen.",
    phase: 2,
  },
  {
    id: "gpu-dimensions-case",
    severity: "block",
    summary: "GPU-Länge und -Breite gegen das Gehäuse prüfen.",
    phase: 2,
  },
  {
    id: "cooler-dimensions-case",
    severity: "block",
    summary: "Kühler- oder Radiator-Höhe gegen das Gehäuse prüfen.",
    phase: 2,
  },
  {
    id: "psu-power-reserve",
    severity: "block",
    summary: "Netzteil-Leistung plus Sicherheitsreserve prüfen.",
    phase: 2,
  },
  {
    id: "pcie-12vhpwr",
    severity: "block",
    summary: "PCIe- und 12VHPWR-Anschlüsse prüfen.",
    phase: 2,
  },
  {
    id: "cpu-cooler-tdp",
    severity: "warning",
    summary: "CPU-Kühler-TDP plausibilisieren.",
    phase: 2,
  },
  {
    id: "bios-compatibility",
    severity: "warning",
    summary: "BIOS-Hinweis bei möglicher CPU-/Board-Inkompatibilität.",
    phase: 2,
  },
] as const

export function listPlannedRuleIds(): RuleId[] {
  return RULE_CATALOG.map((rule) => rule.id)
}
