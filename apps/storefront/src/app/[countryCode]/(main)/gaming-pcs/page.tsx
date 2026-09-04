import { Metadata } from "next"

import { formatEuro, SYSTEM_PRESETS } from "@bootlabs/configurator"
import { findProductByHandle } from "@lib/data/configurator"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Gaming-PCs",
  description:
    "Vorkonfigurierte Bootlabs PLAY-, CREATE- und REFRESH-Systeme. Festpreis, gebaut in Deutschland.",
}

export default async function GamingPcsPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  const systems = await Promise.all(
    SYSTEM_PRESETS.map(async (system) => ({
      system,
      product: await findProductByHandle(system.handle, countryCode),
    }))
  )

  return (
    <div className="catalog-page">
      <div className="content-container">
        <p className="kicker">GAMING-PCS</p>
        <h1>Fünf Systeme, klarer Festpreis.</h1>
        <p className="catalog-lead">
          PLAY für Spiele, CREATE für Schnitt und Stream, REFRESH für den
          Alltag. Jedes Gerät wird gebaut, getestet und mit Ansprechpartner
          geliefert.
        </p>
        <div className="system-grid">
          {systems.map(({ system, product }) => (
            <article key={system.id} className="system-card">
              <p className="kicker">{system.targetResolution}</p>
              <h2>{system.name}</h2>
              <p>{system.tagline}</p>
              <ul>
                {system.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="system-price">{formatEuro(system.priceCents)}</p>
              <p className="system-meta">
                Lieferzeit ca. {system.leadTimeDays} Werktage
              </p>
              <div className="cta-row">
                {product ? (
                  <LocalizedClientLink
                    className="button button-primary"
                    href={`/products/${product.handle}`}
                  >
                    Ansehen
                  </LocalizedClientLink>
                ) : (
                  <LocalizedClientLink
                    className="button button-primary"
                    href="/konfigurator"
                  >
                    Konfigurieren
                  </LocalizedClientLink>
                )}
                <LocalizedClientLink
                  className="button button-ghost"
                  href="/konfigurator"
                >
                  Anpassen
                </LocalizedClientLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
