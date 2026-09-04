import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  addToCartWorkflow,
  completeCartWorkflow,
} from "@medusajs/medusa/core-flows"
import {
  assertConfigurationReady,
  configurationIdFromMetadata,
  configurationIdsFromItems,
} from "../../lib/configuration-cart"
import { medusaAmountFromCents } from "../../lib/money"
import { CONFIGURATOR_MODULE } from "../../modules/configurator"
import type ConfiguratorModuleService from "../../modules/configurator/service"

addToCartWorkflow.hooks.validate(async ({ input }, { container }) => {
  const configurator: ConfiguratorModuleService =
    container.resolve(CONFIGURATOR_MODULE)

  for (const item of input.items ?? []) {
    const configurationId = configurationIdFromMetadata(item.metadata)
    if (!configurationId) {
      continue
    }
    const result = await configurator.revalidate(configurationId)
    assertConfigurationReady(result)
    item.unit_price = medusaAmountFromCents(result.price.totalCents)
  }
})

completeCartWorkflow.hooks.validate(async ({ input }, { container }) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data: carts } = await query.graph({
    entity: "cart",
    fields: ["id", "items.metadata"],
    filters: { id: input.id },
  })
  const cart = carts?.[0] as { items?: Array<{ metadata?: Record<string, unknown> }> }
  const ids = configurationIdsFromItems(cart?.items ?? [])
  if (ids.length === 0) {
    return
  }

  const configurator: ConfiguratorModuleService =
    container.resolve(CONFIGURATOR_MODULE)
  for (const id of ids) {
    const result = await configurator.revalidate(id)
    assertConfigurationReady({
      ok: result.ok,
      publicReference: result.publicReference,
      message: `Konfiguration ${result.publicReference} muss vor dem Kauf neu geprüft werden.`,
    })
  }
})
