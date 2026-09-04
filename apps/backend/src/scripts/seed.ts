import {
  COMPONENT_CATALOG,
  CUSTOM_BUILD_HANDLE,
  RULE_CATALOG,
  SYSTEM_PRESETS,
} from "@bootlabs/configurator"
import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { medusaAmountFromCents } from "../lib/money"
import { CONFIGURATOR_MODULE } from "../modules/configurator"
import type ConfiguratorModuleService from "../modules/configurator/service"
import { seedCommerce } from "./seed-commerce"

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const { salesChannel, shippingProfile } = await seedCommerce({ container })
  const configurator: ConfiguratorModuleService =
    container.resolve(CONFIGURATOR_MODULE)

  const existing = await configurator.listComponents({}, { take: 1 })
  if (existing.length === 0) {
    await configurator.createComponents(
      COMPONENT_CATALOG.map((item) => ({
        id: item.id,
        sku: item.sku,
        ean: item.ean ?? null,
        name: item.name,
        manufacturer: item.manufacturer,
        manufacturer_part_number: item.manufacturerPartNumber ?? null,
        component_type: item.type,
        purchase_price_cents: item.purchasePriceCents,
        target_margin_percent: item.targetMarginPercent,
        tax_rate: item.taxRate,
        technical_specification: item.specifications,
        active: item.active,
        purchasable: item.purchasable,
        stock_status: item.stockStatus,
      }))
    )
    logger.info(`Seeded ${COMPONENT_CATALOG.length} configurator components.`)
  } else {
    logger.info("Configurator components already present, skipping.")
  }

  const existingRules = await configurator.listCompatibleRules({}, { take: 1 })
  if (existingRules.length === 0) {
    await configurator.createCompatibleRules(
      RULE_CATALOG.map((rule) => ({
        id: rule.id,
        rule_type: rule.id,
        severity: rule.severity,
        source_component_type: null,
        target_component_type: null,
        expression: { id: rule.id, phase: rule.phase },
        message_customer: rule.summary,
        message_internal: rule.summary,
        active: true,
      }))
    )
    logger.info(`Seeded ${RULE_CATALOG.length} compatibility rules.`)
  }

  const productModule = container.resolve(Modules.PRODUCT)
  const [existingProducts] = await productModule.listAndCountProducts({
    handle: [
      ...SYSTEM_PRESETS.map((system) => system.handle),
      CUSTOM_BUILD_HANDLE,
      "bootlabs-wifi-modul",
      "bootlabs-setup-service",
    ],
  })
  const existingHandles = new Set(
    existingProducts.map((product: { handle?: string }) => product.handle)
  )

  const products = [
    ...SYSTEM_PRESETS.map((system) => ({
      title: system.name,
      handle: system.handle,
      description: `${system.tagline} Ziel: ${system.targetResolution}. Lieferzeit ca. ${system.leadTimeDays} Werktage.`,
      status: "published" as const,
      shipping_profile_id: shippingProfile.id,
      options: [{ title: "Variante", values: ["Standard"] }],
      metadata: {
        bootlabs_system: system.id,
        target_resolution: system.targetResolution,
        lead_time_days: String(system.leadTimeDays),
        highlights: system.highlights.join(" · "),
        component_ids: system.componentIds.join(","),
      },
      sales_channels: [{ id: salesChannel.id }],
      variants: [
        {
          title: "Standard",
          sku: system.id.toUpperCase(),
          options: { Variante: "Standard" },
          prices: [
            {
              amount: medusaAmountFromCents(system.priceCents),
              currency_code: "eur",
            },
          ],
          manage_inventory: false,
        },
      ],
    })),
    {
      title: "Bootlabs Custom",
      handle: CUSTOM_BUILD_HANDLE,
      description:
        "Frei konfigurierter Gaming-PC. Preis und Kompatibilität kommen aus dem Konfigurator.",
      status: "published" as const,
      shipping_profile_id: shippingProfile.id,
      options: [{ title: "Variante", values: ["Konfiguriert"] }],
      metadata: { bootlabs_custom: "true" },
      sales_channels: [{ id: salesChannel.id }],
      variants: [
        {
          title: "Konfiguriert",
          sku: "CUSTOM-PC",
          options: { Variante: "Konfiguriert" },
          prices: [{ amount: 0, currency_code: "eur" }],
          manage_inventory: false,
        },
      ],
    },
    {
      title: "WLAN-Modul",
      handle: "bootlabs-wifi-modul",
      description: "WLAN und Bluetooth zum Nachrüsten.",
      status: "published" as const,
      shipping_profile_id: shippingProfile.id,
      options: [{ title: "Variante", values: ["Standard"] }],
      sales_channels: [{ id: salesChannel.id }],
      variants: [
        {
          title: "Standard",
          sku: "ACC-WIFI-KIT",
          options: { Variante: "Standard" },
          prices: [
            {
              amount: medusaAmountFromCents(3900),
              currency_code: "eur",
            },
          ],
          manage_inventory: false,
        },
      ],
    },
    {
      title: "Einrichtung & Datenübernahme",
      handle: "bootlabs-setup-service",
      description: "Wir richten das System ein und übernehmen deine Daten.",
      status: "published" as const,
      shipping_profile_id: shippingProfile.id,
      options: [{ title: "Variante", values: ["Standard"] }],
      sales_channels: [{ id: salesChannel.id }],
      variants: [
        {
          title: "Standard",
          sku: "SVC-SETUP",
          options: { Variante: "Standard" },
          prices: [
            {
              amount: medusaAmountFromCents(8900),
              currency_code: "eur",
            },
          ],
          manage_inventory: false,
        },
      ],
    },
  ].filter((product) => !existingHandles.has(product.handle))

  if (products.length === 0) {
    logger.info("Catalog products already present, skipping.")
    return
  }

  await createProductsWorkflow(container).run({
    input: { products },
  })
  logger.info(`Seeded ${products.length} catalog products.`)
}
