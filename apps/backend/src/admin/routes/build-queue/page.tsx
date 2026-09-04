import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

type BuildOrder = {
  id: string
  order_id: string
  state: string
  configuration_id?: string | null
}

const BuildQueuePage = () => {
  const [orders, setOrders] = useState<BuildOrder[]>([])

  useEffect(() => {
    fetch("/admin/build-orders", { credentials: "include" })
      .then((response) => response.json() as Promise<{ build_orders?: BuildOrder[] }>)
      .then((payload) => setOrders(payload.build_orders ?? []))
      .catch(() => setOrders([]))
  }, [])

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Build Queue</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Offene Builds nach Bestelleingang.
        </Text>
      </div>
      <div className="px-6 py-4 flex flex-col gap-3">
        {orders.length === 0 ? (
          <Text>Keine offenen Builds.</Text>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border rounded-md px-3 py-2">
              <Text weight="plus">{order.id}</Text>
              <Text size="small">Bestellung {order.order_id}</Text>
              <Text size="small">Status: {order.state}</Text>
            </div>
          ))
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Build Queue",
})

export default BuildQueuePage
