import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

type Rental = {
  id: string
  status: string
  monthly_rate_cents: number
  notes?: string | null
}

const RentalsPage = () => {
  const [rentals, setRentals] = useState<Rental[]>([])

  useEffect(() => {
    fetch("/admin/rentals", { credentials: "include" })
      .then((response) => response.json() as Promise<{ rentals?: Rental[] }>)
      .then((payload) => setRentals(payload.rentals ?? []))
      .catch(() => setRentals([]))
  }, [])

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Miete</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Eingehende Mietanfragen. Stripe Billing kommt, sobald die Keys stehen.
        </Text>
      </div>
      <div className="px-6 py-4 flex flex-col gap-2">
        {rentals.length === 0 ? (
          <Text>Keine Mietanfragen.</Text>
        ) : (
          rentals.map((item) => (
            <div key={item.id} className="border rounded-md px-3 py-2">
              <Text weight="plus">
                {item.id} · {item.status}
              </Text>
              <Text size="small">
                {item.monthly_rate_cents} ct / Monat
                {item.notes ? ` · ${item.notes}` : ""}
              </Text>
            </div>
          ))
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Miete",
})

export default RentalsPage
