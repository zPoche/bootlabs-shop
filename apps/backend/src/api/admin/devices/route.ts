import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DEVICES_MODULE } from "../../../modules/devices"
import type DevicesModuleService from "../../../modules/devices/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const devicesService: DevicesModuleService = req.scope.resolve(DEVICES_MODULE)
  const devices = await devicesService.listDevices({}, { take: 100 })
  res.json({ devices })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const devicesService: DevicesModuleService = req.scope.resolve(DEVICES_MODULE)
  const device = await devicesService.createDevices(
    req.body as {
      asset_tag: string
      serial_number: string
      status?: string
      device_condition?: string
      order_id?: string | null
      configuration_id?: string | null
    }
  )
  res.status(201).json({ device })
}
