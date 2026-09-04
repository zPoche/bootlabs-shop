# @bootlabs/medusa-plugin-configurator

Das Konfigurator-Modul liegt in `apps/backend/src/modules/configurator`.

- Store-API: `GET /store/components`, `GET /store/systems`, `POST /store/configurations`, `POST /store/configurations/:id/validate`
- Warenkorb: `configuration_id` in Line-Item-Metadata
- Preise nur serverseitig verbindlich über `@bootlabs/configurator`
