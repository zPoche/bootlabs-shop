import {
  configurationIdFromMetadata,
  configurationIdsFromItems,
} from "../configuration-cart"

describe("configuration cart helpers", () => {
  it("reads configuration ids from line items", () => {
    expect(
      configurationIdsFromItems([
        { metadata: { configuration_id: "cfg_1" } },
        { metadata: { configuration_id: "cfg_1" } },
        { metadata: { sku: "x" } },
      ])
    ).toEqual(["cfg_1"])
  })

  it("ignores empty metadata", () => {
    expect(configurationIdFromMetadata(null)).toBeNull()
    expect(configurationIdFromMetadata({})).toBeNull()
  })
})
