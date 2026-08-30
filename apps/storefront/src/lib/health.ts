export function getStorefrontHealth() {
  return {
    ok: true as const,
    service: "bootlabs-storefront",
    phase: 0,
    medusaBackendUrl:
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  }
}
