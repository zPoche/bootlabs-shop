# Security

- Do not commit secrets, Stripe live keys, or production database credentials.
- Stripe is used in **test mode only** until a later, explicit go-live decision.
- Prices and compatibility results from the browser are never authoritative.
  Server-side validation is mandatory before checkout (Phase 2+).
- Stripe webhooks must verify signatures and be processed idempotently (Phase 1+).
- Report security issues privately to the Bootlabs maintainers. Do not open a
  public issue with exploit details.

Historical Medusa security policy from the original fork is archived at
`docs/licenses/MEDUSA-SECURITY.md`.
