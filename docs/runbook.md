# Runbook

## Entwicklung

```bash
cp .env.example .env
pnpm install
docker compose -f infra/compose.yaml up -d postgres redis
pnpm --filter @bootlabs/medusa db:migrate
pnpm --filter @bootlabs/medusa user -- -e admin@bootlabs.local -p change-me
pnpm dev
```

Einzelprozesse:

```bash
pnpm dev:medusa
pnpm dev:storefront
```

## Docker-Start (voller Stack)

```bash
cp .env.example .env
pnpm compose:up
pnpm compose:ps
pnpm compose:logs
```

Images:

- `infra/Dockerfile.medusa` — Production-Start aus `apps/medusa/.medusa/server`
- `infra/Dockerfile.storefront`

Compose veröffentlicht Postgres, Redis, Medusa und Storefront auf dem Host.
Medusa erreicht die Datenbanken über `host-gateway` (veröffentlichte Ports), nicht über die interne Docker-Bridge. Das ist auf Linux-VMs und Docker Desktop zuverlässiger, wenn Inter-Container-TCP eingeschränkt ist.

Healthchecks müssen `healthy` sein, bevor der Stack als gestartet gilt.

```bash
docker compose -f infra/compose.yaml ps
curl -fsS http://localhost:9000/health
curl -fsS http://localhost:8000/api/health
```

Stoppen: `pnpm compose:down`

## Migrationen

Immer aus `apps/medusa` bzw. per Filter:

```bash
pnpm --filter @bootlabs/medusa db:migrate
```

Nach Medusa-Updates zuerst Release Notes, dann dieselbe Command. Rollback nur modulweise mit `medusa db:rollback <module>` — siehe Update-Prozess.

Phase-0-Seed ist leer. Kein Demo-Katalog.

## Logs

Lokal: Terminal der `pnpm dev`-Prozesse.

Docker:

```bash
pnpm compose:logs
docker compose -f infra/compose.yaml logs medusa
docker compose -f infra/compose.yaml logs storefront
```

## Backups

Phase 0: tägliche PostgreSQL-Dumps sind Pflicht, sobald echte Daten existieren.

```bash
docker compose -f infra/compose.yaml exec postgres \
  pg_dump -U bootlabs bootlabs > backup-$(date +%F).sql
```

Dumps verschlüsselt und außerhalb der VM lagern. Redis ist Cache/Event-Bus, kein System of Record.

## Deployment

1. `.env` auf dem Host aus `env.example` ableiten, Secrets rotieren
2. `pnpm compose:up` oder Images in die Registry schieben
3. Healthchecks prüfen
4. Admin-User anlegen, wenn die Datenbank leer ist
5. Caddy/Cloudflare später auf 8000 (Shop) und 9000 (API/Admin) legen

Staging und Produktion trennen. Stripe dort nur Testmodus, bis Go-Live extra entschieden wird.

Rollback: vorheriges Image-Tag starten, bei Schema-Änderungen zuerst Module rollbacken.

## Störungen

| Symptom | Prüfung |
| --- | --- |
| Medusa startet nicht | `DATABASE_URL`, `DATABASE_SSL=false` gegen lokales Postgres, Redis erreichbar |
| Admin leer / Vite-Fehler | Port 5173, nicht `/app` als Docker-WORKDIR verwenden (`/server`) |
| Storefront 500 | `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, Build `standalone` |
| Compose unhealthy | `docker compose logs`, `curl /health` |
| pnpm Admin-Build | `.npmrc` Hoist-Patterns nicht entfernen |

## Qualität vor Merge

```bash
pnpm check
```
