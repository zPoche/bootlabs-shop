# Shop auf dem Server aktualisieren

Stand: 2026-09-04. Medusa **2.20.1**. Alles nach Merge auf `develop`.

Checkout auf der VM: `~/coding/bootlabs-shop`

## Was jetzt auf develop ist

- Deutscher Storefront, Bootlabs-Design
- Katalog: PLAY 1080 / 1440 / 4K, CREATE, REFRESH, Zubehör, Custom-Build, Einrichtung
- Konfigurator unter `/de/konfigurator`
- Admin: Build-Queue, Konfigurator, Geräte, RMA, Miete
- Stripe-Checkout, sobald die Test-Keys in `.env` stehen
- Mietanfragen; Admin-Freigabe startet Stripe-Abo, Webhook `/hooks/stripe-billing`

## Nicht machen

```bash
# löscht die Datenbank
docker compose -f infra/compose.yaml down -v
```

Nur `pnpm compose:down` stoppt Container und behält Volumes.

## 1. Code holen

```bash
cd ~/coding/bootlabs-shop
git fetch origin
git checkout develop
git pull origin develop
```

`git log -1 --oneline` sollte Medusa 2.20.1 und den Seed-/Checkout-Fix enthalten.

## 2. `.env` prüfen

Datei: `~/coding/bootlabs-shop/.env` (nicht committen).

Falls du den Shop im Browser über die Server-IP oder eine Domain öffnest, `localhost` ersetzen — sonst ruft der Browser Medusa auf dem Laptop statt auf der VM auf:

```bash
# Beispiel mit öffentlicher Adresse, Ports anpassen
STORE_CORS=http://DEINE-IP-ODER-DOMAIN:8000
ADMIN_CORS=http://DEINE-IP-ODER-DOMAIN:9000
AUTH_CORS=http://DEINE-IP-ODER-DOMAIN:9000,http://DEINE-IP-ODER-DOMAIN:8000
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://DEINE-IP-ODER-DOMAIN:9000
NEXT_PUBLIC_SITE_URL=http://DEINE-IP-ODER-DOMAIN:8000
```

Nur lokal auf der VM im Browser: `localhost` ist in Ordnung.

Admin (einmalig, nur wenn noch keiner existiert):

```bash
MEDUSA_ADMIN_EMAIL=admin@bootlabs.de
MEDUSA_ADMIN_PASSWORD='ein-starkes-passwort'
```

Stripe Testmodus (Checkout). Dashboard: https://dashboard.stripe.com/test/apikeys

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
# optional, erst wenn ein Webhook existiert:
# STRIPE_WEBHOOK_SECRET=whsec_...
```

`NEXT_PUBLIC_*` und der Stripe-Publishable-Key werden **beim Image-Build** ins Storefront gebacken. Nach Änderungen an diesen Zeilen immer neu bauen (`pnpm compose:up`).

## 3. Stack neu bauen

```bash
cd ~/coding/bootlabs-shop
pnpm compose:up
```

Das baut Images neu, startet Postgres, Redis, Medusa und Storefront. Medusa führt beim Start automatisch `db:migrate` aus (neue Module: Konfigurator, Operations, Geräte, Miete).

Warten, bis beide Healthchecks grün sind:

```bash
docker compose -f infra/compose.yaml --env-file .env ps
curl -fsS http://127.0.0.1:9000/health
curl -fsS http://127.0.0.1:8000/api/health
```

Logs:

```bash
docker compose -f infra/compose.yaml --env-file .env logs -f medusa
# anderes Terminal:
docker compose -f infra/compose.yaml --env-file .env logs -f storefront
```

Admin-Bootstrap in den Medusa-Logs:

```bash
docker compose -f infra/compose.yaml --env-file .env logs medusa | grep -i 'Admin bootstrap'
```

`created user` = neuer Admin. `already exists, skipping` = war schon da.

## 4. Katalog seeden

Nur einmal nötig (danach überspringt das Script vorhandene Komponenten und Produkte):

```bash
cd ~/coding/bootlabs-shop
docker compose -f infra/compose.yaml --env-file .env exec medusa \
  sh -c 'cd /server/apps/backend && npx medusa exec ./src/scripts/seed.ts'
```

Der Seed legt Region DE/EUR, Versand, Zahlungsanbieter und (einmalig) den Publishable Key an. In den Medusa-Logs nach `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_…` suchen.

Wenn Katalogprodukte schon mit dem alten Seed (Beträge in Cent) existieren, Preise in Admin prüfen — Medusa erwartet Euro, nicht Cent. Zur Not die Shop-Produkte löschen und Seed nochmal laufen lassen (Komponenten bleiben).

Stripe-Billing-Webhook (Miete), zusätzlich zum Medusa-Payment-Hook:

```text
http://DEINE-IP:9000/hooks/stripe-billing
```

Events: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`. Secret nach `STRIPE_BILLING_WEBHOOK_SECRET` oder `STRIPE_WEBHOOK_SECRET`.

## 5. Admin und Publishable Key

1. Browser: `http://DEINE-IP-ODER-DOMAIN:9000/app`
2. Mit `MEDUSA_ADMIN_EMAIL` / Passwort einloggen
3. Settings → API Key Management → Publishable API Key anlegen
4. Den Key (`pk_…`) in `.env` setzen:

```bash
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
```

5. Storefront neu bauen: `pnpm compose:up`
6. `MEDUSA_ADMIN_PASSWORD` aus `.env` löschen, danach nochmal `pnpm compose:up`

Im Admin danach prüfen: Regionen (Deutschland / EUR), Sales Channel, Produkte (PLAY / CREATE / REFRESH / Custom / WLAN / Setup).

## 6. Im Browser prüfen

- Shop: `http://…:8000/de`
- Systeme: `http://…:8000/de/gaming-pcs`
- Konfigurator: `http://…:8000/de/konfigurator`
- Impressum / Datenschutz: `/de/impressum`, `/de/datenschutz`
- Admin: `http://…:9000/app` — Build Queue, Konfigurator, Geräte, RMA, Miete

Warenkorb und Checkout nur mit echtem Publishable Key und (für Karte) Stripe-Testkeys.

## 7. Backup, bevor echte Daten drin sind

```bash
cd ~/coding/bootlabs-shop
docker compose -f infra/compose.yaml --env-file .env exec postgres \
  pg_dump -U bootlabs bootlabs > ~/bootlabs-shop-$(date +%F).sql
```

Dump nicht auf derselben Platte allein liegen lassen.

## Störungen

| Symptom | Was tun |
| --- | --- |
| Storefront lädt, Katalog leer | Seed gelaufen? Publishable Key gesetzt und Storefront neu gebaut? |
| Browser ruft `localhost:9000` auf | `NEXT_PUBLIC_MEDUSA_BACKEND_URL` auf die öffentliche Medusa-URL, dann `pnpm compose:up` |
| CORS-Fehler Shop → API | `STORE_CORS` / `AUTH_CORS` auf die echte Shop-Origin, Medusa neu starten |
| Admin-Login unter HTTP geht nicht | `MEDUSA_COOKIE_SECURE=false` |
| `medusa user` im Container scheitert | ignorieren; Bootstrap über `MEDUSA_ADMIN_*` in `.env` |
| Stripe fehlt im Checkout | Keys in `.env`, dann Images neu bauen |
| Container „unhealthy“ | `compose logs medusa` / `storefront`, Health-URLs oben |

Mehr Betrieb: [runbook.md](runbook.md).
