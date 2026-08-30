# Runbook

## Entwicklung

```bash
cp .env.example .env
pnpm install
docker compose -f infra/compose.yaml up -d postgres redis
pnpm --filter @bootlabs/backend db:migrate
pnpm --filter @bootlabs/backend user -- -e admin@bootlabs.local -p change-me
pnpm dev
```

Einzelprozesse:

```bash
pnpm dev:backend
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

- `infra/Dockerfile.medusa` — Migrationen + optionaler Admin-Bootstrap, dann Start aus `apps/backend/.medusa/server`
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

## Einmaliger Admin-Bootstrap (Docker/Produktion)

`docker compose exec medusa npx medusa user …` aus dem Container-Root `/server` schlägt fehl (`must be run inside a Medusa project` / fehlendes `tsconfig.json`). Stattdessen den Entrypoint-Bootstrap nutzen.

Ablauf:

1. In `.env` **beide** Variablen setzen (Platzhalter stehen auskommentiert in `.env.example`):
   ```bash
   MEDUSA_ADMIN_EMAIL=admin@bootlabs.local
   MEDUSA_ADMIN_PASSWORD='choose-a-strong-password'
   ```
2. Frischer Stack bzw. leere DB:
   ```bash
   docker compose -f infra/compose.yaml --env-file .env down -v
   pnpm compose:up
   ```
3. Logs prüfen (Passwort wird nie geloggt):
   ```bash
   docker compose -f infra/compose.yaml logs medusa | grep -i 'Admin bootstrap'
   ```
   Erwartet beim ersten Start: `Admin bootstrap created user …`
4. Login unter [http://localhost:9000/app](http://localhost:9000/app)
5. Bootstrap deaktivieren: `MEDUSA_ADMIN_PASSWORD` aus `.env` entfernen (empfohlen auch `MEDUSA_ADMIN_EMAIL`), dann Container neu starten.
6. Weitere Starts mit derselben E-Mail loggen `already exists, skipping` und legen keinen zweiten Admin an.

Nur eine der beiden Variablen gesetzt → Warnung, kein User. Beide unset → Bootstrap inaktiv.

Lokal ohne Docker weiterhin:

```bash
pnpm --filter @bootlabs/backend user -- -e admin@bootlabs.local -p change-me
# oder
pnpm --filter @bootlabs/backend bootstrap:admin
```

## Migrationen

Immer aus `apps/backend` bzw. per Filter:

```bash
pnpm --filter @bootlabs/backend db:migrate
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
2. Für den ersten Deploy optional `MEDUSA_ADMIN_EMAIL` + `MEDUSA_ADMIN_PASSWORD` setzen
3. `pnpm compose:up` oder Images in die Registry schieben
4. Healthchecks prüfen, Admin-Login unter `/app` verifizieren
5. `MEDUSA_ADMIN_PASSWORD` aus der Produktions-`.env` entfernen und Medusa neu starten
6. Caddy/Cloudflare später auf 8000 (Shop) und 9000 (API/Admin) legen

Staging und Produktion trennen. Stripe dort nur Testmodus, bis Go-Live extra entschieden wird.

Rollback: vorheriges Image-Tag starten, bei Schema-Änderungen zuerst Module rollbacken.

## Störungen

| Symptom | Prüfung |
| --- | --- |
| Medusa startet nicht | `DATABASE_URL`, `DATABASE_SSL=false` gegen lokales Postgres, Redis erreichbar |
| Admin leer / Vite-Fehler | Port 5173, nicht `/app` als Docker-WORKDIR verwenden (`/server`) |
| `medusa user` im Container fehlschlägt | Nicht aus `/server` mit `npx medusa user` starten; Entrypoint-Bootstrap oder `cd /server/apps/backend` nutzen |
| Admin fehlt nach Compose | Beide `MEDUSA_ADMIN_*` gesetzt? Logs `Admin bootstrap` prüfen |
| Storefront 500 | `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, Publishable Key, Regionen in Admin |
| Compose unhealthy | `docker compose logs`, `curl /health` |
| pnpm Admin-Build | `.npmrc` Hoist-Patterns nicht entfernen |

## Qualität vor Merge

```bash
pnpm check
```
