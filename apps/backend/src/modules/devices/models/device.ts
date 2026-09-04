import { model } from "@medusajs/framework/utils"

const Device = model.define("bl_device", {
  id: model.id({ prefix: "dev" }).primaryKey(),
  asset_tag: model.text(),
  serial_number: model.text(),
  status: model.text().default("in_build"),
  configuration_id: model.text().nullable(),
  order_id: model.text().nullable(),
  device_condition: model.text().default("new"),
  qc_status: model.text().nullable(),
  qc_report_url: model.text().nullable(),
  photos: model.json().nullable(),
  wipe_status: model.text().nullable(),
  warranty_end_at: model.dateTime().nullable(),
})

export default Device
