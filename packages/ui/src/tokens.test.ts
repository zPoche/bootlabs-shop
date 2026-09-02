import { describe, expect, it } from "vitest"
import { tokens } from "./tokens"

describe("bootlabs tokens", () => {
  it("exposes the brand accent", () => {
    expect(tokens.accent).toBe("#0b6b5a")
    expect(tokens.name).toBe("bootlabs")
  })
})
