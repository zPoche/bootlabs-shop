export const COMPONENT_TYPES = [
  "cpu",
  "mainboard",
  "ram",
  "gpu",
  "cooler",
  "case",
  "psu",
  "ssd",
  "os",
  "accessory",
] as const

export type ComponentType = (typeof COMPONENT_TYPES)[number]

export type RuleSeverity = "block" | "warning" | "info"

export type RuleId =
  | "cpu-socket-mainboard"
  | "ram-generation-mainboard"
  | "gpu-dimensions-case"
  | "cooler-dimensions-case"
  | "psu-power-reserve"
  | "pcie-12vhpwr"
  | "cpu-cooler-tdp"
  | "bios-compatibility"

export type ComponentRef = {
  id: string
  type: ComponentType
  sku?: string
  specifications?: Record<string, unknown>
}

export type CompatibilityIssue = {
  ruleId: RuleId
  severity: RuleSeverity
  message: string
}

export type CompatibilityResult = {
  ok: boolean
  engine: "planned" | "active"
  issues: CompatibilityIssue[]
}

export type PriceBreakdown = {
  currency: "EUR"
  componentsCents: number
  marginCents: number
  totalCents: number
  authoritative: boolean
}

export type ConfigurationSnapshot = {
  id: string
  publicReference: string
  selectedComponents: ComponentRef[]
  calculatedPriceCents: number
  compatibility: CompatibilityResult
  createdAt: string
  expiresAt: string
}
