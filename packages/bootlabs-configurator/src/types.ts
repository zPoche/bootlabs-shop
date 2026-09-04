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

export type PowerConnector = "8pin" | "8+8pin" | "12vhpwr"

export type ComponentSpec = {
  socket?: string
  tdpWatts?: number
  biosGeneration?: string
  ramGeneration?: string
  ramSlots?: number
  pcieVersion?: string
  has12vhpwr?: boolean
  biosReadyCpus?: string[]
  sticks?: number
  speedMhz?: number
  lengthMm?: number
  widthSlots?: number
  powerConnector?: PowerConnector
  coolerType?: "air" | "aio"
  heightMm?: number
  radiatorMm?: number
  maxGpuLengthMm?: number
  maxCoolerHeightMm?: number
  maxRadiatorMm?: number
  wattage?: number
  connectors?: PowerConnector[]
  interface?: string
}

export type ComponentRecord = {
  id: string
  sku: string
  ean?: string
  name: string
  manufacturer: string
  manufacturerPartNumber?: string
  type: ComponentType
  purchasePriceCents: number
  targetMarginPercent: number
  taxRate: number
  specifications: ComponentSpec
  active: boolean
  purchasable: boolean
  stockStatus: "in_stock" | "low" | "backorder"
}

export type ComponentRef = {
  id: string
  type: ComponentType
  sku?: string
  name?: string
  specifications?: ComponentSpec | Record<string, unknown>
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
  estimatedPowerWatt: number
}

export type PriceBreakdown = {
  currency: "EUR"
  componentsCents: number
  marginCents: number
  taxCents: number
  totalCents: number
  authoritative: boolean
}

export type ConfigurationSnapshot = {
  id: string
  publicReference: string
  selectedComponents: ComponentRef[]
  calculatedPriceCents: number
  estimatedPowerWatt: number
  estimatedBuildTimeDays: number
  compatibility: CompatibilityResult
  price: PriceBreakdown
  createdAt: string
  expiresAt: string
}

export type SystemPreset = {
  id: string
  handle: string
  name: string
  tagline: string
  targetResolution: string
  priceCents: number
  leadTimeDays: number
  componentIds: string[]
  highlights: string[]
}
