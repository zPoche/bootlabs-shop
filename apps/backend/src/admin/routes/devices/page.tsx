import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

type Device = {
  id: string
  asset_tag: string
  serial_number: string
  device_condition: string
  status: string
}

const DevicesPage = () => {
  const [devices, setDevices] = useState<Device[]>([])

  useEffect(() => {
    fetch("/admin/devices", { credentials: "include" })
      .then((response) => response.json() as Promise<{ devices?: Device[] }>)
      .then((payload) => setDevices(payload.devices ?? []))
      .catch(() => setDevices([]))
  }, [])

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Geräte</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Seriennummern, Zustand, QC und Garantie.
        </Text>
      </div>
      <div className="px-6 py-4 flex flex-col gap-2">
        {devices.length === 0 ? (
          <Text>Noch keine Geräte erfasst.</Text>
        ) : (
          devices.map((device) => (
            <div key={device.id} className="border rounded-md px-3 py-2">
              <Text weight="plus">{device.asset_tag}</Text>
              <Text size="small">
                SN {device.serial_number} · {device.device_condition} ·{" "}
                {device.status}
              </Text>
            </div>
          ))
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Geräte",
})

export default DevicesPage
