import {
  buildSnapshot,
  calculateAuthoritativePrice,
  evaluateCompatibility,
  toComponentRef,
  type ComponentRecord,
  type ComponentSpec,
  type ComponentType,
} from "@bootlabs/configurator"
import { MedusaService } from "@medusajs/framework/utils"
import Component from "./models/component"
import CompatibleRule from "./models/compatible-rule"
import PcConfiguration from "./models/pc-configuration"

type StoredComponent = {
  id: string
  sku: string
  ean?: string | null
  name: string
  manufacturer: string
  manufacturer_part_number?: string | null
  component_type: string
  purchase_price_cents: number
  target_margin_percent: number
  tax_rate: number
  technical_specification: ComponentSpec
  active: boolean
  purchasable: boolean
  stock_status: ComponentRecord["stockStatus"]
}

function toRecord(row: StoredComponent): ComponentRecord {
  return {
    id: row.id,
    sku: row.sku,
    ean: row.ean ?? undefined,
    name: row.name,
    manufacturer: row.manufacturer,
    manufacturerPartNumber: row.manufacturer_part_number ?? undefined,
    type: row.component_type as ComponentType,
    purchasePriceCents: row.purchase_price_cents,
    targetMarginPercent: row.target_margin_percent,
    taxRate: row.tax_rate,
    specifications: row.technical_specification ?? {},
    active: row.active,
    purchasable: row.purchasable,
    stockStatus: row.stock_status,
  }
}

class ConfiguratorModuleService extends MedusaService({
  Component,
  CompatibleRule,
  PcConfiguration,
}) {
  async snapshotFromComponentIds(input: {
    componentIds: string[]
    customerId?: string
  }) {
    const rows = (await this.listComponents({
      id: input.componentIds,
    })) as StoredComponent[]

    if (rows.length === 0) {
      throw new Error("Keine Komponenten gefunden.")
    }

    const records = rows.map(toRecord)
    const created = await this.createPcConfigurations({
      public_reference: "pending",
      status: "draft",
      customer_id: input.customerId ?? null,
      selected_components: { items: records.map(toComponentRef) },
      calculated_price_cents: 0,
      estimated_power_watt: 0,
      estimated_build_time_days: 5,
      compatibility_result: {},
      price_breakdown: {},
      expires_at: new Date(),
    })

    const snapshot = buildSnapshot({
      id: created.id,
      records,
    })

    await this.updatePcConfigurations({
      id: created.id,
      public_reference: snapshot.publicReference,
      status: snapshot.compatibility.ok ? "valid" : "invalid",
      selected_components: { items: snapshot.selectedComponents },
      calculated_price_cents: snapshot.calculatedPriceCents,
      estimated_power_watt: snapshot.estimatedPowerWatt,
      estimated_build_time_days: snapshot.estimatedBuildTimeDays,
      compatibility_result: snapshot.compatibility,
      price_breakdown: snapshot.price,
      expires_at: new Date(snapshot.expiresAt),
    })

    return snapshot
  }

  async revalidate(id: string) {
    const configuration = await this.retrievePcConfiguration(id)
    const stored = configuration.selected_components as {
      items?: ReturnType<typeof toComponentRef>[]
    }
    const selected = stored.items ?? []
    const compatibility = evaluateCompatibility(selected)
    const rows = (await this.listComponents({
      id: selected.map((item) => item.id),
    })) as StoredComponent[]
    const price = calculateAuthoritativePrice(rows.map(toRecord))

    await this.updatePcConfigurations({
      id,
      status: compatibility.ok ? "valid" : "invalid",
      compatibility_result: compatibility,
      price_breakdown: price,
      calculated_price_cents: price.totalCents,
      estimated_power_watt: compatibility.estimatedPowerWatt,
    })

    return {
      id,
      publicReference: configuration.public_reference,
      compatibility,
      price,
      ok: compatibility.ok,
    }
  }
}

export default ConfiguratorModuleService
