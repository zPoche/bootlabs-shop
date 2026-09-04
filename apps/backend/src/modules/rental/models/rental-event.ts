import { model } from "@medusajs/framework/utils"

const RentalEvent = model.define("bl_rental_event", {
  id: model.id({ prefix: "rev" }).primaryKey(),
  rental_contract_id: model.text(),
  type: model.text(),
  actor: model.text().default("system"),
  payload: model.json().nullable(),
})

export default RentalEvent
