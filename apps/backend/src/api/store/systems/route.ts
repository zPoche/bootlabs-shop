import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SYSTEM_PRESETS, componentsByIds, formatEuro } from "@bootlabs/configurator"

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  res.json({
    systems: SYSTEM_PRESETS.map((system) => ({
      ...system,
      priceLabel: formatEuro(system.priceCents),
      components: componentsByIds(system.componentIds).map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
      })),
    })),
  })
}
