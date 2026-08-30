# Medusa nur als Dependency aktualisieren

Medusa ist eine versionierte Abhängigkeit. Dieses Repository ist **kein** Core-Fork mehr.

## Verboten

```bash
git remote add upstream https://github.com/medusajs/medusa.git
git merge upstream/develop
git merge upstream/main
```

Solche Merges würden den entfernten Core-Tree zurückbringen und Bootlabs-Code zerstören.

## Erlaubt

1. **Version feststellen**
   ```bash
   pnpm --filter @bootlabs/medusa exec medusa -v
   ```
2. **Release Notes** von [medusajs/medusa releases](https://github.com/medusajs/medusa/releases) lesen. Breaking Changes notieren.
3. **Alle `@medusajs/*` auf dieselbe Version** setzen. Medusa versioniert die Commerce-Pakete gemeinsam. Design-System-Pakete (`@medusajs/ui`) können abweichen — Release Notes beachten.
4. **Installieren**
   ```bash
   pnpm install
   ```
5. **Migrationen**
   ```bash
   pnpm --filter @bootlabs/medusa db:migrate
   ```
6. **Prüfen**
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   ```
7. **Staging-Checkout** eines vorkonfigurierten PCs (ab Phase 1) gegen Stripe Testmode.

## Konsistenz

Nicht einzelne `@medusajs/*`-Pakete mischen (z. B. Framework 2.20 und Medusa 2.19). Ausnahme: unabhängig versionierte UI-Pakete laut offizieller Update-Doku.

## Rollback

1. Betroffene Module identifizieren
2. `pnpm --filter @bootlabs/medusa exec medusa db:rollback <module> ...`
3. Versionen in `package.json` zurücksetzen
4. `pnpm install`
5. `db:migrate` für Link-Sync

## pnpm

`.npmrc` Hoist-Patterns beibehalten. Sie sind für Medusa Admin unter pnpm erforderlich.

Dokumentation: [Updating Medusa](https://docs.medusajs.com/learn/update), [pnpm](https://docs.medusajs.com/learn/configurations/pnpm).
