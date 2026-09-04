import { describe, expect, it } from "vitest"
import { tokens } from "./tokens"

describe("bootlabs tokens", () => {
  it("exposes the brand accent from the website", () => {
    expect(tokens.accent).toBe("#7C5CFF")
    expect(tokens.background).toBe("#0A0B0D")
    expect(tokens.name).toBe("bootlabs")
  })
})
