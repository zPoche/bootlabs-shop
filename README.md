# Bootlabs Shop

Deutschsprachiger Gaming-PC-Systemintegrator. Dieses Repository ist die **Bootlabs-Commerce-Anwendung**, kein gepflegter Medusa-Core-Fork.

Medusa v2 kommt ausschließlich als versionierte npm-Dependency (`@medusajs/*` 2.19.0). Updates laufen über `package.json`, Migrationen und Tests — nie über `git merge upstream`.

## Zielbild

1. Direktkauf vorkonfigurierter und frei konfigurierbarer Gaming-PCs
2. Zubehör, Software und Servicepakete
3. Später: Hardware-as-a-Service / PC-Miete
4. Eigener Konfigurator mit serverseitiger Kompatibilität und Preiskalkulation
5. Geräte-Lebenszyklus: Seriennummer, Build, Burn-in, Versand, RMA, Refurbishment

Phase 0 (dieses Release) liefert nur das technische Fundament. Phase 1 startet erst nach Freigabe.

## Struktur

```text
apps/medusa                    Medusa-v2-Anwendung
apps/storefront                Next.js Shop
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
pnpm --filter @bootlabs/medusa db:migrate
pnpm dev
```

Medusa: [http://localhost:9000](http://localhost:9000)  
Admin: [http://localhost:9000/app](http://localhost:9000/app)  
Storefront: [http://localhost:8000](http://localhost:8000)

Admin-User anlegen:

```bash
pnpm --filter @bootlabs/medusa user -- -e admin@bootlabs.local -p change-me
```

### Voller Docker-Stack

```bash
cp .env.example .env
pnpm compose:up
pnpm compose:ps
```

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

Nur Testmodus. In `.env` die Platzhalter `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` und `STRIPE_WEBHOOK_SECRET` erst in Phase 1 mit `sk_test_` / `pk_test_`-Werten füllen. Keine Live-Keys, keine Keys im Frontend als Secret.

## Dokumentation

- [docs/architecture.md](docs/architecture.md) — Entscheidung, Migration vom Core-Fork
- [docs/domain-model.md](docs/domain-model.md) — geplante Domäne inkl. Phase 1/2
- [docs/api-contracts.md](docs/api-contracts.md) — vorhandene und geplante APIs
- [docs/runbook.md](docs/runbook.md) — Betrieb, Logs, Backups, Deployment
- [docs/medusa-update-process.md](docs/medusa-update-process.md) — Dependency-Updates

## Was Phase 0 bewusst nicht enthält

- Produktkatalog und die fünf PLAY/CREATE/REFRESH-Modelle
- Warenkorb, Checkout, Stripe-Zahlung
- funktionierenden Konfigurator
- Mietvertrag, Bonität, Kaufoption
- Änderungen am Medusa-Core
