import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

type BuildOrder = {
  id: string
  order_id: string
  state: string
  configuration_id?: string | null
}

const NEXT: Record<string, string | undefined> = {
  queued: "parts_reserved",
  parts_reserved: "assembling",
  assembling: "qc",
  qc: "burn_in",
  burn_in: "ready_to_ship",
  ready_to_ship: "shipped",
}

const BuildQueuePage = () => {
  const [orders, setOrders] = useState<BuildOrder[]>([])
  const [busy, setBusy] = useState<string | null>(null)

  const load = () => {
    fetch("/admin/build-orders", { credentials: "include" })
      .then((response) => response.json() as Promise<{ build_orders?: BuildOrder[] }>)
      .then((payload) => setOrders(payload.build_orders ?? []))
      .catch(() => setOrders([]))
  }

  useEffect(() => {
    load()
  }, [])

  const advance = async (order: BuildOrder) => {
    const state = NEXT[order.state]
    if (!state) return
    setBusy(order.id)
    await fetch(`/admin/build-orders/${order.id}/state`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state }),
    })
    setBusy(null)
    load()
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Build Queue</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Offene Builds nach Bestelleingang. Versand legt automatisch ein Gerät an.
        </Text>
      </div>
      <div className="px-6 py-4 flex flex-col gap-3">
        {orders.length === 0 ? (
          <Text>Keine offenen Builds.</Text>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border rounded-md px-3 py-2 flex justify-between gap-4">
              <div>
                <Text weight="plus">{order.id}</Text>
                <Text size="small">Bestellung {order.order_id}</Text>
                <Text size="small">Status: {order.state}</Text>
              </div>
              {NEXT[order.state] ? (
                <Button
                  size="small"
                  isLoading={busy === order.id}
                  onClick={() => advance(order)}
                >
                  Weiter: {NEXT[order.state]}
                </Button>
              ) : null}
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
