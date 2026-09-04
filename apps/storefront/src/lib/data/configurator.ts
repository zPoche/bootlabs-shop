"use server"

import {
  COMPONENT_CATALOG,
  CUSTOM_BUILD_HANDLE,
  SYSTEM_PRESETS,
  type ConfigurationSnapshot,
} from "@bootlabs/configurator"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders } from "./cookies"
import { listProducts } from "./products"

export async function listSystems() {
  return SYSTEM_PRESETS
}

export async function listCatalogComponents() {
  try {
    const payload = await sdk.client.fetch<{
      components: Array<{
        id: string
        name: string
        sku: string
        component_type: string
        technical_specification: Record<string, unknown>
        purchase_price_cents: number
        target_margin_percent: number
        tax_rate: number
      }>
    }>("/store/components", {
      method: "GET",
      headers: await getAuthHeaders(),
      cache: "no-store",
    })
    if (payload.components?.length) {
      return payload.components.map((item) => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        type: item.component_type as (typeof COMPONENT_CATALOG)[number]["type"],
        purchasePriceCents: item.purchase_price_cents,
        targetMarginPercent: item.target_margin_percent,
        taxRate: item.tax_rate,
        specifications: item.technical_specification,
        manufacturer: "Bootlabs",
        active: true,
        purchasable: true,
        stockStatus: "in_stock" as const,
      }))
    }
  } catch {
    // Catalog fallback until the backend is seeded.
  }
  return COMPONENT_CATALOG
}

export async function createConfiguration(
  componentIds: string[]
): Promise<ConfigurationSnapshot> {
  try {
    const payload = await sdk.client.fetch<{
      configuration: ConfigurationSnapshot
    }>("/store/configurations", {
      method: "POST",
      headers: {
        ...(await getAuthHeaders()),
        "content-type": "application/json",
      },
      body: { component_ids: componentIds },
    })
    return payload.configuration
  } catch {
    throw new Error(
      "Konfiguration konnte serverseitig nicht geprüft werden. Seed und Publishable Key prüfen."
    )
  }
}

export async function findProductByHandle(
  handle: string,
  countryCode: string
): Promise<HttpTypes.StoreProduct | null> {
  try {
    const { response } = await listProducts({
      countryCode,
      queryParams: { handle, limit: 1 },
    })
    return response.products[0] ?? null
  } catch {
    return null
  }
}

export async function findCustomBuildProduct(countryCode: string) {
  return findProductByHandle(CUSTOM_BUILD_HANDLE, countryCode)
}
