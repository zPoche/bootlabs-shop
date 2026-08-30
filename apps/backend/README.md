# @bootlabs/backend

Offizielle Medusa-v2-Anwendung im [create-medusa-app](https://docs.medusajs.com/learn/installation)-Layout.

Medusa selbst liegt nur als npm-Dependency (`@medusajs/medusa` 2.19.0). Bootlabs-Fachlogik kommt ausschließlich über lokale Plugins unter `packages/medusa-plugin-*`, sobald diese echte Module haben.

```bash
pnpm --filter @bootlabs/backend dev
pnpm --filter @bootlabs/backend db:migrate
pnpm --filter @bootlabs/backend user -- -e admin@bootlabs.local -p change-me
```

Dokumentation: [docs/architecture.md](../../docs/architecture.md), [Medusa Docs](https://docs.medusajs.com).
