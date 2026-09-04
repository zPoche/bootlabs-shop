import { model } from "@medusajs/framework/utils"

const Component = model.define("bl_component", {
  id: model.id({ prefix: "comp" }).primaryKey(),
  sku: model.text(),
  ean: model.text().nullable(),
  name: model.text(),
  manufacturer: model.text(),
  manufacturer_part_number: model.text().nullable(),
  component_type: model.text(),
  purchase_price_cents: model.number(),
  target_margin_percent: model.number(),
  tax_rate: model.number().default(19),
  technical_specification: model.json(),
  active: model.boolean().default(true),
  purchasable: model.boolean().default(true),
  stock_status: model.text().default("in_stock"),
})

export default Component
