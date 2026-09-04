import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CONFIGURATOR_MODULE } from "../../../modules/configurator"
import type ConfiguratorModuleService from "../../../modules/configurator/service"

type CreateBody = {
  component_ids?: string[]
  customer_id?: string
}

export async function POST(req: MedusaRequest<CreateBody>, res: MedusaResponse) {
  const componentIds = req.validatedBody?.component_ids ?? req.body?.component_ids
  if (!Array.isArray(componentIds) || componentIds.length === 0) {
    res.status(400).json({ message: "component_ids fehlen." })
    return
  }

  const configurator: ConfiguratorModuleService = req.scope.resolve(
    CONFIGURATOR_MODULE
  )

  const snapshot = await configurator.snapshotFromComponentIds({
    componentIds,
    customerId: req.body?.customer_id,
  })

  res.status(201).json({ configuration: snapshot })
}
