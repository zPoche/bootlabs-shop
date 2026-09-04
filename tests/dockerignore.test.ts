import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("dockerignore", () => {
  it("ignores nested node_modules so Compose does not overlay host installs", () => {
    const ignore = readFileSync(resolve(process.cwd(), ".dockerignore"), "utf8")
    expect(ignore).toContain("**/node_modules")
  })
})
