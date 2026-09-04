import { MedusaService } from "@medusajs/framework/utils"
import Device from "./models/device"

class DevicesModuleService extends MedusaService({
  Device,
}) {}

export default DevicesModuleService
