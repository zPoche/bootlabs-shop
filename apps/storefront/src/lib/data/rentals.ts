"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export async function requestRental(input: {
  monthlyRateCents: number
  configurationId?: string
  notes?: string
}) {
  return sdk.client.fetch<{ rental: { id: string; status: string } }>(
    "/store/rentals",
    {
      method: "POST",
      headers: {
        ...(await getAuthHeaders()),
        "content-type": "application/json",
      },
      body: {
        monthly_rate_cents: input.monthlyRateCents,
        configuration_id: input.configurationId,
        notes: input.notes,
      },
    }
  )
}
