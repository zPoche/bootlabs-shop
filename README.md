# Bootlabs Shop

Deutschsprachiger Gaming-PC-Systemintegrator. Dieses Repository ist die **Bootlabs-Commerce-Anwendung**, kein gepflegter Medusa-Core-Fork.

Die Basis ist die offizielle [create-medusa-app](https://docs.medusajs.com/learn/installation) / [dtc-starter](https://github.com/medusajs/dtc-starter)-Struktur: Medusa-Backend und Next.js-Storefront als pnpm-Workspace. Medusa v2 kommt ausschließlich als versionierte npm-Dependency (`@medusajs/*` 2.19.0). Updates laufen über `package.json`, Migrationen und Tests — nie über `git merge upstream`.

Bootlabs-Fachlogik liegt nur in lokalen Plugins und Modulen unter `packages/`.

## Zielbild

1. Direktkauf vorkonfigurierter und frei konfigurierbarer Gaming-PCs
2. Zubehör, Software und Servicepakete
3. Später: Hardware-as-a-Service / PC-Miete
4. Eigener Konfigurator mit serverseitiger Kompatibilität und Preiskalkulation
5. Geräte-Lebenszyklus: Seriennummer, Build, Burn-in, Versand, RMA, Refurbishment

Phase 1–3 sind im Shop umgesetzt: Katalog, Konfigurator, Build-Queue, Geräte/RMA. Miete bleibt blockiert.

## Struktur

```text
apps/backend                   offizielle Medusa-v2-App (@bootlabs/backend)
apps/storefront                offizieller Medusa Next.js Storefront
packages/ui                    Design-Tokens
packages/bootlabs-configurator gemeinsame Typen, Regelkatalog, Preisvertrag
packages/medusa-plugin-*       lokale Plugins (Skelette, noch nicht registriert)
infra/                         Compose, Dockerfiles, env.example
docs/                          Architektur, Domäne, Runbook, Update-Prozess
```

## Voraussetzungen

- Node.js 20.19+ oder 22.12+ (`.nvmrc` = 22)
- pnpm 10
- Docker + Docker Compose für den vollen Stack
- PostgreSQL 16 und Redis 7 (lokal oder per Compose)

## Schnellstart

```bash
cp .env.example .env
pnpm install
```

### Nur Infrastruktur (Postgres + Redis)

```bash
docker compose -f infra/compose.yaml up -d postgres redis
pnpm --filter @bootlabs/backend db:migrate
pnpm dev
```

Medusa: [http://localhost:9000](http://localhost:9000)  
Admin: [http://localhost:9000/app](http://localhost:9000/app)  
Storefront: [http://localhost:8000](http://localhost:8000)

Admin-User lokal anlegen:

```bash
pnpm --filter @bootlabs/backend user -- -e admin@bootlabs.local -p change-me
```

### Voller Docker-Stack

Für den ersten Produktions-/Compose-Start optional einen einmaligen Admin-Bootstrap aktivieren. In `.env` beide Variablen setzen (siehe auskommentierte Platzhalter in `.env.example`):

```bash
MEDUSA_ADMIN_EMAIL=admin@bootlabs.local
MEDUSA_ADMIN_PASSWORD='choose-a-strong-password'
```

```bash
cp .env.example .env
# MEDUSA_ADMIN_EMAIL und MEDUSA_ADMIN_PASSWORD setzen
pnpm compose:up
pnpm compose:ps
```

Der Medusa-Container migriert die DB und legt den Admin an, falls die E-Mail noch nicht existiert. Danach:

1. Login unter [http://localhost:9000/app](http://localhost:9000/app)
2. `MEDUSA_ADMIN_PASSWORD` aus `.env` entfernen (am besten auch `MEDUSA_ADMIN_EMAIL`)
3. Container neu starten: `pnpm compose:up`

Nicht `docker compose exec medusa npx medusa user …` aus `/server` ausführen — das scheitert außerhalb des Medusa-App-Roots. Der Bootstrap läuft automatisch im Entrypoint aus `apps/backend`.

Healthchecks:

- Postgres: `pg_isready`
- Redis: `redis-cli ping`
- Medusa: `GET /health`
- Storefront: `GET /api/health`

Herunterfahren: `pnpm compose:down`

## Qualitätsbefehle

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
# oder alles nacheinander
pnpm check
./scripts/check-phase0.sh
```

## Stripe

Der Checkout kann bereits Karten über Stripe. Es fehlen nur deine Test-Keys.

1. Account auf [dashboard.stripe.com](https://dashboard.stripe.com) (Testmodus oben rechts).
2. Keys unter [API keys](https://dashboard.stripe.com/test/apikeys):
   - Secret key → `STRIPE_SECRET_KEY=sk_test_...`
   - Publishable key → `STRIPE_PUBLISHABLE_KEY=pk_test_...` und dieselbe Zeile als `NEXT_PUBLIC_STRIPE_KEY=pk_test_...`
3. Optional Webhook auf `https://deine-domain:9000/hooks/payment/stripe_stripe` → `STRIPE_WEBHOOK_SECRET=whsec_...`
4. `pnpm compose:up` neu bauen, damit der Storefront den Publishable Key einpackt.

Keine Live-Keys (`sk_live_` / `pk_live_`), solange ihr testet. Das Secret kommt nie ins Frontend.

## Dokumentation

- [docs/architecture.md](docs/architecture.md) — Entscheidung, Migration vom Core-Fork
- [docs/domain-model.md](docs/domain-model.md) — geplante Domäne inkl. Phase 1/2
- [docs/api-contracts.md](docs/api-contracts.md) — vorhandene und geplante APIs
- [docs/runbook.md](docs/runbook.md) — Betrieb, Logs, Backups, Deployment
- [docs/server-update.md](docs/server-update.md) — Shop auf der VM aktualisieren
- [docs/medusa-update-process.md](docs/medusa-update-process.md) — Dependency-Updates

## Was bewusst nicht enthalten ist

- Änderungen am Medusa-Core

Nach dem Deploy:

```bash
pnpm --filter @bootlabs/backend db:migrate
pnpm --filter @bootlabs/backend seed
```
