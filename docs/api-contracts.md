# API-Verträge

## Vorhanden (Phase 0)

| Methode | Pfad | Quelle | Zweck |
| --- | --- | --- | --- |
| GET | `/health` | Medusa Core | Container-Healthcheck |
| GET | `/store/health` | `apps/medusa` | Bootlabs-Status JSON |
| GET | `/app` | Medusa Admin | Backoffice |
| GET | `/api/health` | Storefront | Container-Healthcheck |
| GET | `/` | Storefront | Phase-0-Landingpage |

`GET /store/health` Antwort:

```json
{
  "ok": true,
  "service": "bootlabs-medusa",
  "phase": 0,
  "commerceEngine": "medusa-v2-dependency",
  "stripeMode": "test-keys-reserved"
}
```

`GET /api/health` Antwort:

```json
{
  "ok": true,
  "service": "bootlabs-storefront",
  "phase": 0,
  "medusaBackendUrl": "http://localhost:9000"
}
```

Store- und Admin-APIs von Medusa (`/store/*`, `/admin/*`) sind über die Dependency verfügbar, sobald die Datenbank migriert ist. Sie werden in Phase 0 nicht um Bootlabs-Katalogdaten erweitert.

## Geplant Phase 1

| Vertrag | Beschreibung |
| --- | --- |
| Medusa Store Products | PLAY/CREATE/REFRESH + Zubehör |
| Medusa Store Cart / Checkout | Einmalkauf |
| Stripe Payment Session | Testmodus, Keys aus Env |
| Admin Build Queue | offene `BuildOrder`s |
| Storefront-Seiten | `/gaming-pcs`, Warenkorb, Bestellbestätigung |

Stripe-Webhooks (Phase 1, signaturgeprüft, idempotent):

- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

## Geplant Phase 2

| Vertrag | Beschreibung |
| --- | --- |
| `POST /store/configurations` | Snapshot anlegen, serverseitig bepreisen und prüfen |
| `POST /store/configurations/:id/validate` | Revalidierung |
| Cart-Line-Item | `configuration_id` im Metadata |
| Admin Configurator | Komponenten, Regeln, Preisfreigabe |

Client-Preise sind Vorschau. `assertServerAuthoritative` in `@bootlabs/configurator` erzwingt das kontraktuell.

## Geplant Phase 4 (blockiert)

Keine öffentlichen Miet-Endpunkte. Stripe-Billing-Webhooks erst nach Freigabe:

- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.*`

## Auth und Keys

- Storefront-Aufrufe an Medusa brauchen später einen Publishable API Key (`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`).
- Admin braucht einen User (`pnpm --filter @bootlabs/medusa user`).
- Keine Stripe-Secret-Keys im Browser.
