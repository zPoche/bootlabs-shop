import { Metadata } from "next"

import {
  createConfiguration,
  findCustomBuildProduct,
  listCatalogComponents,
} from "@lib/data/configurator"
import ConfiguratorForm from "@modules/configurator/configurator-form"

export const metadata: Metadata = {
  title: "Konfigurator",
  description:
    "Gaming-PC selbst zusammenstellen. Kompatibilität und Preis prüft Bootlabs auf dem Server.",
}

export default async function ConfiguratorPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const components = await listCatalogComponents()
  const customProduct = await findCustomBuildProduct(countryCode)
  const customVariantId = customProduct?.variants?.[0]?.id

  return (
    <div className="catalog-page">
      <div className="content-container">
        <p className="kicker">KONFIGURATOR</p>
        <h1>Zusammenstellen. Prüfen. Bestellen.</h1>
        <p className="catalog-lead">
          Sockel, RAM, GPU-Maß, Kühler, Netzteilreserve und 12VHPWR laufen
          serverseitig. Der Preis im Browser ist nur Vorschau.
        </p>
        <ConfiguratorForm
          components={components}
          customVariantId={customVariantId}
          createConfiguration={createConfiguration}
        />
      </div>
    </div>
  )
}
