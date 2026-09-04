export const pluginId = "medusa-plugin-rental"

export const pluginStatus = {
  id: pluginId,
  phase: 4,
  registeredInMedusa: true,
  implemented: true,
  blockedOn: [] as const,
} as const

export {
  RENTAL_NOT_IMPLEMENTED,
  assertRentalNotImplemented,
} from "./extension-points"
export type {
  RentalContract,
  RentalContractStatus,
  RentalEvent,
  RentalEventType,
} from "./extension-points"
