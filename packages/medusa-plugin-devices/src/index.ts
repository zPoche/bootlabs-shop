export const pluginId = "medusa-plugin-devices"

export type DeviceCondition =
  | "new"
  | "rental_active"
  | "returned"
  | "repair"
  | "refurbishable"
  | "sold"

export const pluginStatus = {
  id: pluginId,
  phase: 3,
  registeredInMedusa: true,
  plannedEntities: ["Device"],
  plannedFields: [
    "asset_tag",
    "serial_number",
    "status",
    "configuration_id",
    "order_id",
    "device_condition",
    "qc_status",
    "wipe_status",
    "warranty_end_at",
  ],
} as const
