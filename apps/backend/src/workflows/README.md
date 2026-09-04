# Workflows

`hooks/cart-configuration.ts` hängt an `addToCartWorkflow` und `completeCartWorkflow`:

- Konfiguration revalidieren
- Blocker stoppen den Checkout
- `unit_price` kommt vom Server (Euro, nicht Cent)

Miet-Abos laufen über `POST /admin/rentals/:id/approve` und `POST /hooks/stripe-billing`.
