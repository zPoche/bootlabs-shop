import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

type Rental = {
  id: string
  status: string
  monthly_rate_cents: number
  notes?: string | null
}

const RentalsPage = () => {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const load = () => {
    fetch("/admin/rentals", { credentials: "include" })
      .then((response) => response.json() as Promise<{ rentals?: Rental[] }>)
      .then((payload) => setRentals(payload.rentals ?? []))
      .catch(() => setRentals([]))
  }

  useEffect(() => {
    load()
  }, [])

  const approve = async (id: string) => {
    setBusy(id)
    setMessage(null)
    const response = await fetch(`/admin/rentals/${id}/approve`, {
      method: "POST",
      credentials: "include",
    })
    const payload = (await response.json()) as {
      checkout_url?: string | null
      message?: string
    }
    setBusy(null)
    if (payload.checkout_url) {
      setMessage(`Checkout: ${payload.checkout_url}`)
    } else if (!response.ok) {
      setMessage(payload.message ?? "Freigabe fehlgeschlagen.")
    }
    load()
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Miete</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Anfragen freigeben. Mit Stripe-Key entsteht ein Abo-Checkout für die Monatsrate.
        </Text>
        {message ? <Text size="small">{message}</Text> : null}
      </div>
      <div className="px-6 py-4 flex flex-col gap-2">
        {rentals.length === 0 ? (
          <Text>Keine Mietanfragen.</Text>
        ) : (
          rentals.map((item) => (
            <div key={item.id} className="border rounded-md px-3 py-2 flex justify-between gap-4">
              <div>
                <Text weight="plus">
                  {item.id} · {item.status}
                </Text>
                <Text size="small">
                  {item.monthly_rate_cents} ct / Monat
                  {item.notes ? ` · ${item.notes}` : ""}
                </Text>
              </div>
              {item.status === "pending_review" ? (
                <Button
                  size="small"
                  isLoading={busy === item.id}
                  onClick={() => approve(item.id)}
                >
                  Freigeben
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
  label: "Miete",
})

export default RentalsPage
