import { model } from "@medusajs/framework/utils"

const RentalContract = model.define("bl_rental_contract", {
  id: model.id({ prefix: "ren" }).primaryKey(),
  customer_id: model.text().nullable(),
  device_id: model.text().nullable(),
  medusa_order_id: model.text().nullable(),
  stripe_customer_id: model.text().nullable(),
  stripe_subscription_id: model.text().nullable(),
  stripe_price_id: model.text().nullable(),
  status: model.text().default("pending_review"),
  starts_at: model.dateTime().nullable(),
  minimum_term_ends_at: model.dateTime().nullable(),
  monthly_rate_cents: model.number(),
  deposit_cents: model.number().default(0),
  deductible_cents: model.number().default(0),
  ownership: model.text().default("bootlabs"),
  configuration_id: model.text().nullable(),
  notes: model.text().nullable(),
})

export default RentalContract
