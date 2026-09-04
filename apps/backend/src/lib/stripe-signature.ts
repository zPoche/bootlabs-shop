import { createHmac, timingSafeEqual } from "crypto"

export function verifyStripeSignature(input: {
  payload: string
  header: string | undefined
  secret: string
  toleranceSeconds?: number
}): boolean {
  if (!input.header) {
    return false
  }

  const parts = Object.fromEntries(
    input.header.split(",").map((part) => {
      const [key, ...rest] = part.split("=")
      return [key.trim(), rest.join("=")]
    })
  )
  const timestamp = parts.t
  const signature = parts.v1
  if (!timestamp || !signature) {
    return false
  }

  const tolerance = input.toleranceSeconds ?? 300
  const age = Math.abs(Date.now() / 1000 - Number(timestamp))
  if (Number.isNaN(Number(timestamp)) || age > tolerance) {
    return false
  }

  const expected = createHmac("sha256", input.secret)
    .update(`${timestamp}.${input.payload}`)
    .digest("hex")

  const expectedBuffer = Buffer.from(expected, "utf8")
  const actualBuffer = Buffer.from(signature, "utf8")
  if (expectedBuffer.length !== actualBuffer.length) {
    return false
  }

  return timingSafeEqual(expectedBuffer, actualBuffer)
}
