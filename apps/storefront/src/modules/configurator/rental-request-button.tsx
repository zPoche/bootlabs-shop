"use client"

import { requestRental } from "@lib/data/rentals"
import { useState } from "react"

export default function RentalRequestButton({
  monthlyRateCents,
  notes,
}: {
  monthlyRateCents: number
  notes: string
}) {
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<string | null>(null)

  return (
    <button
      type="button"
      className="button button-ghost"
      disabled={busy}
      onClick={async () => {
        setBusy(true)
        try {
          const result = await requestRental({
            monthlyRateCents,
            notes,
          })
          setDone(result.rental.id)
        } catch (error) {
          setDone(error instanceof Error ? error.message : "Anfrage fehlgeschlagen")
        } finally {
          setBusy(false)
        }
      }}
    >
      {done
        ? done.startsWith("ren_")
          ? "Mietanfrage raus"
          : done
        : busy
          ? "Senden …"
          : "Mieten anfragen"}
    </button>
  )
}
