import { getStorefrontHealth } from "@/lib/health"

export function GET() {
  return Response.json(getStorefrontHealth())
}
