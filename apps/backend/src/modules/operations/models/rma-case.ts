import { model } from "@medusajs/framework/utils"

const RmaCase = model.define("bl_rma_case", {
  id: model.id({ prefix: "rma" }).primaryKey(),
  device_id: model.text(),
  customer_id: model.text().nullable(),
  type: model.text(),
  status: model.text().default("open"),
  reported_issue: model.text(),
  diagnosis: model.text().nullable(),
  repair_cost_cents: model.number().nullable(),
  return_label_url: model.text().nullable(),
  evidence_urls: model.json().nullable(),
})

export default RmaCase
