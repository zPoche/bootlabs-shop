import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CONFIGURATOR_MODULE } from "../../../modules/configurator"
import type ConfiguratorModuleService from "../../../modules/configurator/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const configurator: ConfiguratorModuleService = req.scope.resolve(
    CONFIGURATOR_MODULE
  )
  const components = await configurator.listComponents({}, { take: 200 })
  res.json({ components })
}
