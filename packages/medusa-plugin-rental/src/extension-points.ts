export type RentalContractStatus =
  | "pending_review"
  | "approved"
  | "active"
  | "payment_failed"
  | "cancellation_requested"
  | "return_due"
  | "closed"
  | "defaulted"

export type RentalContract = {
  id: string
  customerId: string
  deviceId: string
  medusaOrderId: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  stripePriceId: string
  status: RentalContractStatus
  startsAt: string
  minimumTermEndsAt: string
  monthlyRateCents: number
  depositCents: number
  deductibleCents: number
  ownership: "bootlabs"
}

export type RentalEventType =
  | "contract_signed"
  | "device_shipped"
  | "payment_failed"
  | "return_requested"
  | "returned"
  | "damage_assessed"
  | "refurbished"

export type RentalEvent = {
  id: string
  rentalContractId: string
  type: RentalEventType
  timestamp: string
  actor: string
  payload: Record<string, unknown>
}

export const RENTAL_NOT_IMPLEMENTED =
  "Rental requests and Stripe Billing checkout are implemented in apps/backend."

export function assertRentalNotImplemented(): never {
  throw new Error(RENTAL_NOT_IMPLEMENTED)
}
