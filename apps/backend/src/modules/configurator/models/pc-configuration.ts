import { model } from "@medusajs/framework/utils"

const PcConfiguration = model.define("bl_pc_configuration", {
  id: model.id({ prefix: "cfg" }).primaryKey(),
  public_reference: model.text(),
  status: model.text().default("draft"),
  customer_id: model.text().nullable(),
  selected_components: model.json(),
  calculated_price_cents: model.number(),
  estimated_power_watt: model.number(),
  estimated_build_time_days: model.number(),
  compatibility_result: model.json(),
  price_breakdown: model.json(),
  expires_at: model.dateTime(),
})

export default PcConfiguration
