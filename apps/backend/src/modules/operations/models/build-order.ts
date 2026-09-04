import { model } from "@medusajs/framework/utils"

const BuildOrder = model.define("bl_build_order", {
  id: model.id({ prefix: "bld" }).primaryKey(),
  order_id: model.text(),
  configuration_id: model.text().nullable(),
  state: model.text().default("queued"),
  component_reservation_status: model.text().default("pending"),
  assembler: model.text().nullable(),
  qc_checklist: model.json().nullable(),
  burn_in_started_at: model.dateTime().nullable(),
  burn_in_completed_at: model.dateTime().nullable(),
  shipping_ready_at: model.dateTime().nullable(),
})

export default BuildOrder
