import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

type RmaCase = {
  id: string
  device_id: string
  type: string
  status: string
  reported_issue: string
}

const RmaPage = () => {
  const [cases, setCases] = useState<RmaCase[]>([])

  useEffect(() => {
    fetch("/admin/rma-cases", { credentials: "include" })
      .then((response) => response.json() as Promise<{ rma_cases?: RmaCase[] }>)
      .then((payload) => setCases(payload.rma_cases ?? []))
      .catch(() => setCases([]))
  }, [])

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Retouren / RMA</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Reklamationen und Reparaturfälle.
        </Text>
      </div>
      <div className="px-6 py-4 flex flex-col gap-2">
        {cases.length === 0 ? (
          <Text>Keine offenen RMA-Fälle.</Text>
        ) : (
          cases.map((item) => (
            <div key={item.id} className="border rounded-md px-3 py-2">
              <Text weight="plus">
                {item.id} · {item.type}
              </Text>
              <Text size="small">
                {item.status}: {item.reported_issue}
              </Text>
            </div>
          ))
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "RMA",
})

export default RmaPage
