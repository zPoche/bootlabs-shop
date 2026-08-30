import { resolveAdminBootstrapDecision } from "../admin-bootstrap"

describe("resolveAdminBootstrapDecision", () => {
  it("skips when both env vars are unset", () => {
    expect(resolveAdminBootstrapDecision({}, false)).toEqual({
      action: "skip_unset",
    })
  })

  it("treats a missing password as inactive (post-bootstrap deactivation)", () => {
    expect(
      resolveAdminBootstrapDecision({ email: "admin@bootlabs.local" }, false)
    ).toEqual({ action: "skip_unset" })
  })

  it("warns when only the password is set", () => {
    expect(
      resolveAdminBootstrapDecision({ password: "secret" }, false)
    ).toEqual({
      action: "skip_partial",
      present: ["MEDUSA_ADMIN_PASSWORD"],
      missing: ["MEDUSA_ADMIN_EMAIL"],
    })
  })

  it("skips when the email already exists", () => {
    expect(
      resolveAdminBootstrapDecision(
        { email: "admin@bootlabs.local", password: "secret" },
        true
      )
    ).toEqual({
      action: "skip_exists",
      email: "admin@bootlabs.local",
    })
  })

  it("creates when both vars are set and the user is missing", () => {
    expect(
      resolveAdminBootstrapDecision(
        { email: "  admin@bootlabs.local  ", password: "secret" },
        false
      )
    ).toEqual({
      action: "create",
      email: "admin@bootlabs.local",
      password: "secret",
    })
  })
})
