import { defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/hooks/stripe-billing",
      methods: ["POST"],
      bodyParser: { preserveRawBody: true },
    },
  ],
})
