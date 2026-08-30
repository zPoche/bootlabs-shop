import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const databaseUrl = process.env.DATABASE_URL
const redisUrl = process.env.REDIS_URL

module.exports = defineConfig({
  projectConfig: {
    databaseUrl,
    redisUrl,
    databaseDriverOptions:
      process.env.DATABASE_SSL === "true"
        ? undefined
        : {
            ssl: false,
            sslmode: "disable",
          },
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000",
      adminCors:
        process.env.ADMIN_CORS ||
        "http://localhost:9000,http://localhost:5173",
      authCors:
        process.env.AUTH_CORS ||
        "http://localhost:9000,http://localhost:5173,http://localhost:8000",
      jwtSecret: process.env.JWT_SECRET || "change-me-jwt-secret-dev-only",
      cookieSecret:
        process.env.COOKIE_SECRET || "change-me-cookie-secret-dev-only",
    },
  },
  admin: {
    vite: (config) => ({
      ...config,
      server: {
        host: "0.0.0.0",
        allowedHosts: ["localhost", ".localhost", "127.0.0.1"],
        hmr: {
          port: 5173,
          clientPort: 5173,
        },
      },
    }),
  },
  plugins: [
    // Phase 1+: register @bootlabs/medusa-plugin-configurator,
    // @bootlabs/medusa-plugin-devices, @bootlabs/medusa-plugin-operations.
    // Phase 4: register @bootlabs/medusa-plugin-rental after legal review.
  ],
})
