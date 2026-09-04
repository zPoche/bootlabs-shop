# API-Verträge

## Vorhanden (Phase 0)

| Methode | Pfad | Quelle | Zweck |
| --- | --- | --- | --- |
| GET | `/health` | Medusa Core | Container-Healthcheck |
| GET | `/store/health` | `apps/backend` | Bootlabs-Status JSON |
| GET | `/app` | Medusa Admin | Backoffice |
| GET | `/api/health` | Storefront | Container-Healthcheck |
| GET | `/` | Storefront | offizieller Medusa Next.js Starter (Region `/de`) |

`GET /store/health` Antwort:

```json
{
  "ok": true,
  "service": "bootlabs-medusa",
  "phase": 3,
  "commerceEngine": "medusa-v2-dependency",
  "stripeMode": "test-keys-reserved"
}
```

`GET /api/health` Antwort:

```json
{
  "ok": true,
  "service": "bootlabs-storefront",
  "phase": 3,
  "medusaBackendUrl": "http://localhost:9000"
}
```

`GET /store/health` und alle übrigen `/store/*`-Routen verlangen den Medusa-Header `x-publishable-api-key`. Compose-Healthchecks nutzen `GET /health` und `GET /api/health`, die ohne Key antworten.

Store- und Admin-APIs von Medusa (`/store/*`, `/admin/*`) sind über die Dependency verfügbar, sobald die Datenbank migriert ist. Sie sind um Bootlabs-Konfigurator, Systeme und Admin-Queues erweitert.

## Phase 1–4 (umgesetzt)

| Vertrag | Beschreibung |
| --- | --- |
| `GET /store/systems` | PLAY/CREATE/REFRESH-Presets |
| `GET /store/components` | Komponentenstamm |
| `POST /store/configurations` | Snapshot anlegen, serverseitig bepreisen und prüfen |
| `POST /store/configurations/:id/validate` | Revalidierung |
| Cart-Line-Item | `configuration_id` + serverseitiger `unit_price` |
| Medusa Store Products / Cart / Checkout | Einmalkauf, Stripe wenn Key gesetzt |
| `POST /store/rentals` | Mietanfrage |
| `POST /admin/rentals/:id/approve` | Freigabe, optional Stripe-Abo-Checkout |
| `POST /hooks/stripe-billing` | `invoice.paid`, `invoice.payment_failed`, `customer.subscription.*` |
| Admin | Build Queue (Status weiter), Konfigurator, Geräte, RMA, Miete |

Kauf-Webhooks für Karten laufen über Medusas Stripe-Provider (`/hooks/payment/stripe_stripe`), sobald `STRIPE_WEBHOOK_SECRET` gesetzt ist.

Client-Preise sind Vorschau. Checkout revalidiert die Konfiguration serverseitig.

## Auth und Keys

- Storefront-Aufrufe an Medusa brauchen den Publishable API Key (`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`). Der Seed legt einen an und loggt ihn einmal.
- Admin braucht einen User (Compose-Bootstrap oder `pnpm --filter @bootlabs/backend user`).
- Keine Stripe-Secret-Keys im Browser.
