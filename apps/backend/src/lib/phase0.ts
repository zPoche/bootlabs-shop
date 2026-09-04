export const BOOTLABS_SERVICE = "bootlabs-medusa" as const

export const PHASE0_STATUS = {
  service: BOOTLABS_SERVICE,
  phase: 3,
  commerceEngine: "medusa-v2-dependency",
  stripeMode: process.env.STRIPE_SECRET_KEY ? "test" : "test-keys-reserved",
  features: [
    "catalog-play-create-refresh",
    "configurator",
    "build-orders",
    "devices",
    "rma",
  ],
} as const

export function getPhase0Status() {
  return {
    ok: true as const,
    ...PHASE0_STATUS,
    stripeMode: process.env.STRIPE_SECRET_KEY ? "test" : "test-keys-reserved",
  }
}
