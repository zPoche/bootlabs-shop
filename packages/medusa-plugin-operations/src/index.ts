export const pluginId = "medusa-plugin-operations"

export type BuildOrderState =
  | "queued"
  | "parts_reserved"
  | "assembling"
  | "qc"
  | "burn_in"
  | "ready_to_ship"
  | "shipped"

export const pluginStatus = {
  id: pluginId,
  phase: 1,
  registeredInMedusa: false,
  plannedEntities: ["BuildOrder", "RmaCase"],
  plannedAdminViews: ["build-queue", "returns-rma"],
} as const
