import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

type Component = {
  id: string
  name: string
  sku: string
  component_type: string
  purchase_price_cents: number
  active: boolean
}

const ConfiguratorPage = () => {
  const [components, setComponents] = useState<Component[]>([])

  useEffect(() => {
    fetch("/admin/components", { credentials: "include" })
      .then((response) => response.json() as Promise<{ components?: Component[] }>)
      .then((payload) => setComponents(payload.components ?? []))
      .catch(() => setComponents([]))
  }, [])

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Konfigurator</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Komponentenstamm und Pflichtregeln. Preise gelten nur serverseitig.
        </Text>
      </div>
      <div className="px-6 py-4 flex flex-col gap-2">
        {components.map((component) => (
          <div key={component.id} className="border rounded-md px-3 py-2">
            <Text weight="plus">
              {component.name} · {component.sku}
            </Text>
            <Text size="small">
              {component.component_type} · EK {component.purchase_price_cents} ct
            </Text>
          </div>
        ))}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Konfigurator",
})

export default ConfiguratorPage
