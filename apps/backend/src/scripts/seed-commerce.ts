import type { MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { stripePaymentProviderIds } from "../lib/payment-providers"
import {
  createApiKeysWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateRegionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

export async function seedCommerce({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const storeModule = container.resolve(Modules.STORE)
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const regionModule = container.resolve(Modules.REGION)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION)

  const [store] = await storeModule.listStores()
  if (!store) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Kein Medusa-Store vorhanden."
    )
  }

  let [salesChannel] = await salesChannelModule.listSalesChannels()
  if (!salesChannel) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [{ name: "Bootlabs Shop" }],
      },
    })
    salesChannel = result[0]
    logger.info("Created sales channel Bootlabs Shop.")
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: salesChannel.id,
        supported_currencies: [{ currency_code: "eur", is_default: true }],
      },
    },
  })

  const paymentProviders = stripePaymentProviderIds()
  let [region] = await regionModule.listRegions({ currency_code: "eur" })
  if (!region) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Deutschland",
            currency_code: "eur",
            countries: ["de"],
            payment_providers: paymentProviders,
          },
        ],
      },
    })
    region = result[0]
    logger.info("Created region Deutschland / EUR.")
  } else {
    await updateRegionsWorkflow(container).run({
      input: {
        selector: { id: region.id },
        update: { payment_providers: paymentProviders },
      },
    })
    logger.info(
      `Linked payment providers on Deutschland: ${paymentProviders.join(", ")}`
    )
  }

  try {
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: "de", provider_id: "tp_system" }],
    })
  } catch {
    logger.info("Tax region DE already present.")
  }

  let [stockLocation] = await stockLocationModule.listStockLocations({
    name: "Bootlabs Werkstatt",
  })
  if (!stockLocation) {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Bootlabs Werkstatt",
            address: {
              city: "Deutschland",
              country_code: "DE",
              address_1: "Werkstatt",
            },
          },
        ],
      },
    })
    stockLocation = result[0]
    logger.info("Created stock location Bootlabs Werkstatt.")
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { default_location_id: stockLocation.id },
    },
  })

  try {
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    })
  } catch {
    logger.info("Fulfillment provider already linked to Werkstatt.")
  }

  const shippingProfiles = await fulfillmentModule.listShippingProfiles({
    type: "default",
  })
  let shippingProfile = shippingProfiles[0]
  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: {
        data: [{ name: "Bootlabs Versand", type: "default" }],
      },
    })
    shippingProfile = result[0]
  }

  const existingSets = await fulfillmentModule.listFulfillmentSets({
    name: "Bootlabs DE",
  })
  let fulfillmentSet = existingSets[0]
  if (!fulfillmentSet) {
    fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
      name: "Bootlabs DE",
      type: "shipping",
      service_zones: [
        {
          name: "Deutschland",
          geo_zones: [{ country_code: "de", type: "country" }],
        },
      ],
    })
    logger.info("Created fulfillment set Bootlabs DE.")
  }

  try {
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    })
  } catch {
    logger.info("Fulfillment set already linked to Werkstatt.")
  }

  const zones = fulfillmentSet.service_zones?.length
    ? fulfillmentSet.service_zones
    : (
        await fulfillmentModule.retrieveFulfillmentSet(fulfillmentSet.id, {
          relations: ["service_zones"],
        })
      ).service_zones

  const existingOptions = await fulfillmentModule.listShippingOptions({
    name: "Versand Deutschland",
  })
  if (existingOptions.length === 0 && zones?.[0]) {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Versand Deutschland",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Aufbau, Burn-in, Versand aus der Werkstatt.",
            code: "de-standard",
          },
          prices: [
            { currency_code: "eur", amount: 0 },
            { region_id: region.id, amount: 0 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    })
    logger.info("Created shipping option Versand Deutschland.")
  }

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: stockLocation.id, add: [salesChannel.id] },
  })

  const { data: apiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "title"],
    filters: { type: "publishable" },
  })
  let publishable = apiKeys?.[0] as { id: string; token?: string } | undefined
  if (!publishable) {
    const { result } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          { title: "Bootlabs Storefront", type: "publishable", created_by: "" },
        ],
      },
    })
    publishable = result[0]
    if (publishable?.token) {
      logger.info(
        `Publishable API key created. Set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishable.token}`
      )
    }
  } else {
    logger.info(
      "Publishable API key already exists. Copy it from Admin → API Key Management."
    )
  }

  if (publishable?.id) {
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: { id: publishable.id, add: [salesChannel.id] },
    })
  }

  return { salesChannel, region, shippingProfile, stockLocation }
}
