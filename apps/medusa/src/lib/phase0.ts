export const BOOTLABS_SERVICE = "bootlabs-medusa" as const

export const PHASE0_STATUS = {
  service: BOOTLABS_SERVICE,
  phase: 0,
  commerceEngine: "medusa-v2-dependency",
  stripeMode: "test-keys-reserved",
} as const

export function getPhase0Status() {
  return {
    ok: true as const,
    ...PHASE0_STATUS,
  }
}
