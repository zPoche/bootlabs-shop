# Domänenmodell

Phase 1–3 persistieren Bootlabs-Entitäten in den lokalen Modulen `configurator`, `operations` und `devices`. Medusa bleibt Quelle für Katalog, Warenkorb, Bestellung, Kunde und Zahlung.

## Phase 1 — Kauf und Build

### Vorkonfigurierte Systeme

- Bootlabs PLAY 1080
- Bootlabs PLAY 1440
- Bootlabs PLAY 4K
- Bootlabs CREATE
- Bootlabs REFRESH

Jedes Produkt zeigt Zielauflösung, CPU/GPU/RAM/SSD/PSU, Lieferzeit, Kaufpreis. Monatsrate nur später und nur für freigegebene Standardgeräte.

### BuildOrder (Phase 1 Grundmodell)

```text
BuildOrder
- id, order_id, configuration_id?, state
- component_reservation_status
- assembler, qc_checklist
- burn_in_started_at, burn_in_completed_at
- shipping_ready_at
```

Zustände siehe `@bootlabs/medusa-plugin-operations`.

## Phase 2 — Konfigurator

```text
Component
- id, sku, ean, manufacturer, manufacturer_part_number
- component_type: cpu | gpu | mainboard | ram | ssd | psu | case | cooler | fan | os | accessory
- purchase_price_cents, target_margin_percent, tax_rate
- technical_specification JSON
- active, purchasable, stock_status

CompatibleRule
- id, rule_type, severity: block | warning | info
- source / target component
- expression JSON
- message_customer, message_internal

PcConfiguration
- id, public_reference, status
- customer_id?
- selected_components snapshot
- calculated_price_cents, estimated_power_watt
- estimated_build_time_days
- compatibility_result JSON
- expires_at
```

Typen und Regelkatalog liegen in `@bootlabs/configurator`. Die Engine ist aktiv (`engine: "active"`).

Pflichtregeln:

- CPU-Sockel ↔ Mainboard
- RAM-Generation ↔ Mainboard
- GPU-Abmessungen ↔ Gehäuse
- Kühler-/Radiator-Abmessungen ↔ Gehäuse
- Netzteil-Leistungsreserve
- PCIe-/12VHPWR
- CPU-Kühler-TDP
- BIOS-Kompatibilität als Warnung

## Phase 3 — Geräte und Betrieb

```text
Device
- id, asset_tag, serial_number, status
- configuration_id, order_id
- device_condition: new | rental_active | returned | repair | refurbishable | sold
- qc_status, qc_report_url, photos
- wipe_status, warranty_end_at

RmaCase
- id, device_id, customer_id, type, status
- reported_issue, diagnosis, repair_cost_cents
- return_label_url, evidence_urls
```

## Phase 4 — Miete (nur Erweiterungspunkt)

```text
RentalContract
RentalEvent
```

Siehe Modul `rental`. Mietanfragen werden persistiert. Admin-Freigabe kann ein Stripe-Abo anlegen; Webhooks aktualisieren den Vertrag.

## Medusa-Nutzung

Medusa bleibt Quelle für Katalog, Warenkorb, Bestellung, Kunde, Promotion, Fulfillment-Basis und Stripe-Payment-Sessions. Inventory Kits können Stücklisten abbilden, ersetzen aber keine Bundle-Preise und keinen Konfigurator.
