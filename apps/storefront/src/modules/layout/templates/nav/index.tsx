import { Suspense } from "react"

import { copy } from "@lib/content"
import { shopContent } from "@lib/content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BootLogo from "@modules/layout/components/boot-logo"
import CartButton from "@modules/layout/components/cart-button"
import MobileNav from "@modules/layout/components/mobile-nav"

export default async function Nav() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <BootLogo />
        <nav className="nav-desktop" aria-label="Hauptnavigation">
          {shopContent.nav.map((item) => (
            <LocalizedClientLink key={item.href} href={item.href}>
              {item.label}
            </LocalizedClientLink>
          ))}
          <Suspense
            fallback={
              <LocalizedClientLink
                className="button button-primary header-cta"
                href="/cart"
                data-testid="nav-cart-link"
              >
                {copy.cartWithCount(0)}
              </LocalizedClientLink>
            }
          >
            <CartButton />
          </Suspense>
        </nav>
        <MobileNav />
      </div>
    </header>
  )
}
