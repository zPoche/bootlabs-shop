"use client"

import { copy } from "@lib/content"
import { shopContent } from "@lib/content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

function closeMobileNav() {
  const menu = document.querySelector(".nav-mobile-wrap")
  menu?.removeAttribute("open")
}

export default function MobileNav() {
  return (
    <details className="nav-mobile-wrap">
      <summary className="nav-toggle">
        <span className="nav-toggle-bars" aria-hidden="true" />
        <span className="sr-only">{copy.menu}</span>
      </summary>
      <nav className="nav-mobile" aria-label="Mobile Navigation">
        {shopContent.nav.map((item) => (
          <LocalizedClientLink
            key={item.href}
            href={item.href}
            onClick={closeMobileNav}
          >
            {item.label}
          </LocalizedClientLink>
        ))}
        <LocalizedClientLink
          className="button button-primary"
          href="/cart"
          onClick={closeMobileNav}
          data-testid="nav-cart-link-mobile"
        >
          {copy.cart}
        </LocalizedClientLink>
      </nav>
    </details>
  )
}
