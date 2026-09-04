import { model } from "@medusajs/framework/utils"

const CompatibleRule = model.define("bl_compatible_rule", {
  id: model.id({ prefix: "rule" }).primaryKey(),
  rule_type: model.text(),
  severity: model.text(),
  source_component_type: model.text().nullable(),
  target_component_type: model.text().nullable(),
  expression: model.json(),
  message_customer: model.text(),
  message_internal: model.text().nullable(),
  active: model.boolean().default(true),
})

export default CompatibleRule
