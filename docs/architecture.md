# Architektur

## Entscheidung

`bootlabs-shop` bleibt das Repository, wird aber als **eigenständige Bootlabs-Commerce-Anwendung** geführt.

| Thema | Entscheidung |
| --- | --- |
| Shop-Engine | Medusa v2 als npm-Dependency, aktuell **2.20.1** |
| App-Layout | offizielle create-medusa-app / [dtc-starter](https://github.com/medusajs/dtc-starter)-Struktur |
| Backend | `apps/backend` (`@bootlabs/backend`) |
| Storefront | offizieller Medusa Next.js Starter in `apps/storefront` |
| Datenbank | PostgreSQL 16 |
| Cache / Events | Redis 7 |
| Zahlungen | Stripe, nur Testmodus, Anbindung in Phase 1 |
| Betrieb | Docker Compose, später Caddy/Cloudflare davor |
| Package-Manager | pnpm Workspaces |
| Fachlogik | lokale Module/Plugins unter `packages/` |
| Medusa-Core | nicht forken, nicht per Git mergen, nicht editieren |

## Warum kein Core-Fork

Der GitHub-Fork von `medusajs/medusa` war der Ausgangspunkt dieses Repos. Ein gepflegter Core-Fork würde jeden Upstream-Release zu einem Merge-Konflikt machen. Medusa v2 bietet Plugins, Module, Workflows, Subscribers, Jobs und Admin-Extensions. Das reicht für Bootlabs.

Die Fork-Beziehung auf GitHub ist nur Historie. Künftige Updates:

1. Release Notes lesen
2. alle `@medusajs/*` auf dieselbe Version setzen
3. `pnpm install`
4. `medusa db:migrate`
5. Tests und Staging-Checkout

Siehe [medusa-update-process.md](./medusa-update-process.md). **Kein** `git merge upstream/main`.

## Ist-Stand vor der Umstellung

Analysiert am 2026-08-30 auf `develop` @ `f731790360`:

- Vollständiger Medusa-Core-Monorepo (Yarn 3, Turbo)
- Paketversionen intern **2.19.0** (`packages/medusa`, `packages/core/*`)
- Kein Bootlabs-Anwendungscode, kein Storefront, kein Compose
- Issues im GitHub-Repo deaktiviert
- Beschreibung: „Medusa with new modules for Bootlabs.“

## Was entfernt, übernommen oder ersetzt wurde

### Entfernt (Core-Fork-Quellen)

Diese Bäume gehören zum Medusa-Upstream und werden hier nicht weiterentwickelt:

- `packages/` (Medusa-Module, Admin, CLI, Design System, Plugins `loyalty`/`draft-order` aus Upstream)
- `www/` (Medusa-Dokumentationssite)
- `integration-tests/`
- `.changeset/`, `.claude/`, `.github/` (Medusa-CI und Agent-Skills)
- `memory/`, `thoughts/`, `scripts/`
- Yarn-3-Dateien (`yarn.lock`, `.yarn/`, `.yarnrc.yml`)
- Medusa-Root-Tooling (`turbo.json`, Jest-Root, Vale, OAS-Generatoren)

### Übernommen

- **Medusa-Version 2.20.1** als npm-Pin (Fork-Stand war 2.19.0, danach Dependency-Update)
- **Lizenztexte** nach `docs/licenses/` (MIT, Enterprise-Hinweis, Security-Policy)
- **Offizielle App-Konventionen** aus [medusajs/dtc-starter](https://github.com/medusajs/dtc-starter) (MIT): `apps/backend`, `apps/storefront`, `medusa-config.ts`, `src/{api,admin,workflows,modules,subscribers,jobs,links}`

### Ersetzt

| Vorher | Nachher |
| --- | --- |
| Yarn-3-Core-Monorepo | pnpm-App-Monorepo im dtc-starter-Layout |
| Medusa-Quellen im Repo | `@medusajs/*` aus der Registry |
| kein / eigenes Storefront | offizieller Next.js Storefront in `apps/storefront` |
| `apps/medusa` | `apps/backend` (`@bootlabs/backend`) |
| keine Infra | `infra/compose.yaml` + Dockerfiles |
| Medusa-README | Bootlabs-README und `docs/` |

## Laufzeitarchitektur

```text
Browser
  └─ apps/storefront   :8000   Next.js (offizieller Medusa-Starter)
        └─ REST
             └─ apps/backend   :9000   @medusajs/medusa + Admin /app
                    ├─ PostgreSQL :5432
                    └─ Redis      :6379
```

Caddy und Cloudflare sitzen später vor den HTTP-Ports.

## Pakete

| Paket | Rolle | Registriert? |
| --- | --- | --- |
| `@bootlabs/backend` | offizielle Medusa-v2-App | ja, Runtime |
| `@bootlabs/storefront` | offizieller Next.js Storefront | ja, Runtime |
| `@bootlabs/ui` | Tokens | später Storefront/Admin |
| `@bootlabs/configurator` | Typen, Regelkatalog, aktive Engine | ja, Fachbibliothek |
| `@bootlabs/medusa-plugin-configurator` | Status/Vertrag Phase 2 | Modul in der App |
| `@bootlabs/medusa-plugin-devices` | Status/Vertrag Phase 3 | Modul in der App |
| `@bootlabs/medusa-plugin-operations` | Status/Vertrag Phase 1 | Modul in der App |
| `@bootlabs/medusa-plugin-rental` | Mietanfragen | Modul in der App |

Plugins werden erst registriert, wenn sie echte Module und Tests haben. Leere Plugins in `medusa-config.ts` würden nur Update-Risiko erzeugen.

## Sicherheitsregeln

- Secrets nur in `.env`, nie committen
- Stripe-Keys nur `sk_test_` / `pk_test_`
- Preis und Kompatibilität später ausschließlich serverseitig verbindlich
- Webhooks später signaturgeprüft und idempotent
- Uploads später S3-kompatibel, nicht ins Container-Dateisystem

## Phase 1–3 — umgesetzt

- Fünf Standard-PCs, Zubehör, Service, Custom-Build
- Konfigurator mit Pflichtregeln, Snapshot und Warenkorb-`configuration_id`
- BuildOrder bei `order.placed`, Admin-Build-Queue
- Geräte und RMA
- Stripe-Testmodus, sobald `STRIPE_SECRET_KEY` gesetzt ist

## Mietmodell

Mietanfragen liegen im Modul `rental` und in der Admin-Ansicht „Miete“. Freigabe erzeugt bei gesetztem `STRIPE_SECRET_KEY` eine Stripe-Checkout-Session im Abo-Modus. Webhook: `POST /hooks/stripe-billing` (`invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`). Kauf bleibt der Hauptweg.

## Risiken der Core-Fork-Migration

1. **GitHub zeigt weiter „fork of medusajs/medusa“.** Das ist Metadaten, kein Update-Kanal.
2. **Geschichte bleibt groß.** Der Core liegt in `develop`. Dieser Branch ersetzt den Tree; `git log` kennt die alten Dateien weiter.
3. **Enterprise-Quellen** wurden nicht übernommen. `docs/licenses/MEDUSA-ENTERPRISE-LICENSE.md` bleibt als Hinweis.
4. **Eigenes Medusa-Patching** ist verboten. Fehlt eine API, erst Issue/Plugin, dann notfalls ein dokumentierter Fork-Patch.
5. **pnpm-Hoisting** ist für Admin-Pakete nötig (`.npmrc`). Abweichungen können Admin-Builds brechen.
6. **Docker-Images** bauen den ganzen Workspace. Ohne `pnpm-lock.yaml` schlägt `--frozen-lockfile` fehl.
