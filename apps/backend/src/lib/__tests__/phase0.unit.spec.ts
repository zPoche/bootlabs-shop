import { BOOTLABS_SERVICE, getPhase0Status } from "../phase0"

describe("phase0 status", () => {
  it("identifies the Bootlabs Medusa application", () => {
    const status = getPhase0Status()
    expect(status.ok).toBe(true)
    expect(status.service).toBe(BOOTLABS_SERVICE)
    expect(status.phase).toBe(3)
    expect(status.features).toContain("configurator")
    expect(status.features).toContain("rental")
    expect(status.commerceEngine).toBe("medusa-v2-dependency")
  })
})
