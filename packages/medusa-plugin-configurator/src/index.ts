import { RULE_CATALOG } from "@bootlabs/configurator"

export const pluginId = "medusa-plugin-configurator"

export const pluginStatus = {
  id: pluginId,
  phase: 2,
  registeredInMedusa: true,
  plannedModules: ["configurator"],
  plannedEntities: ["Component", "CompatibleRule", "PcConfiguration"],
  plannedRuleCount: RULE_CATALOG.length,
} as const

export {
  evaluateCompatibility,
  estimatePricePreview,
} from "@bootlabs/configurator"
