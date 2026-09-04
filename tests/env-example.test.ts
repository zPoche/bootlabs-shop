import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const REQUIRED = [
  "DATABASE_URL",
  "REDIS_URL",
  "JWT_SECRET",
  "COOKIE_SECRET",
  "STORE_CORS",
  "ADMIN_CORS",
  "AUTH_CORS",
  "STRIPE_SECRET_KEY",
  "STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_KEY",
  "NEXT_PUBLIC_MEDUSA_BACKEND_URL",
  "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_DEFAULT_REGION",
]

describe("env templates", () => {
  it("lists Stripe test placeholders and runtime secrets without values", () => {
    const root = readFileSync(resolve(process.cwd(), ".env.example"), "utf8")
    const infra = readFileSync(
      resolve(process.cwd(), "infra/env.example"),
      "utf8"
    )

    for (const key of REQUIRED) {
      expect(root).toContain(`${key}=`)
      expect(infra).toContain(`${key}=`)
    }

    expect(root).not.toMatch(/sk_live_|pk_live_|whsec_[A-Za-z0-9]{10,}/)
    expect(root).not.toMatch(/sk_test_[A-Za-z0-9]{10,}/)

    // One-time admin bootstrap placeholders stay commented (no live password).
    expect(root).toMatch(/#\s*MEDUSA_ADMIN_EMAIL=/)
    expect(root).toMatch(/#\s*MEDUSA_ADMIN_PASSWORD=/)
    expect(root).toMatch(/#\s*MEDUSA_COOKIE_SECURE=/)
    expect(infra).toMatch(/#\s*MEDUSA_ADMIN_EMAIL=/)
    expect(infra).toMatch(/#\s*MEDUSA_ADMIN_PASSWORD=/)
    expect(infra).toMatch(/#\s*MEDUSA_COOKIE_SECURE=/)
  })
})
