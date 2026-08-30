# @bootlabs/storefront

Official Medusa v2 Next.js storefront for the current Medusa release (**2.19.0**), taken from [medusajs/dtc-starter](https://github.com/medusajs/dtc-starter).

Visible UI matches the official starter (Medusa Store nav/footer, Ecommerce Starter Template hero, official components and styles).

Bootlabs Phase 0 overlays are operational only:

- package name `@bootlabs/storefront`
- default region `de`
- `GET /api/health`
- Docker `output: "standalone"`
- `generateStaticParams` returns `[]` when Medusa or a publishable key is not available yet
- middleware and catalog fetches fail soft so the starter renders without a seeded catalog

Catalog, Bootlabs branding, and checkout customization start in Phase 1.
