import { shopContent } from "@lib/content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BootLogo from "@modules/layout/components/boot-logo"

export default async function Footer() {
  return (
    <footer className="site-footer">
      <div className="content-container footer-row">
        <BootLogo size={21} className="boot-logo-footer" />
        <nav aria-label="Fußzeile">
          {shopContent.footer.links.map((item) =>
            item.href.startsWith("http") ? (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ) : (
              <LocalizedClientLink key={item.href} href={item.href}>
                {item.label}
              </LocalizedClientLink>
            )
          )}
        </nav>
        <p>{shopContent.footer.note}</p>
      </div>
    </footer>
  )
}
