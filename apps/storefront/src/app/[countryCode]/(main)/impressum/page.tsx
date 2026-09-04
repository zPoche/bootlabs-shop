import { Metadata } from "next"

import { shopContent } from "@lib/content"

export const metadata: Metadata = {
  title: "Impressum",
  description: "Anbieterkennzeichnung des Bootlabs-Shops.",
}

export default function ImpressumPage() {
  return (
    <div className="legal-page">
      <div className="content-container">
        <p className="kicker">RECHTLICHES</p>
        <h1>Impressum</h1>
        <p>Angaben gemäß § 5 DDG.</p>

        <h2>Kontakt</h2>
        <p>
          E-Mail:{" "}
          <a href={`mailto:${shopContent.legal.email}`}>
            {shopContent.legal.email}
          </a>
        </p>
        <p>
          Website:{" "}
          <a href={shopContent.legal.siteUrl}>
            {shopContent.legal.siteUrl.replace("https://", "")}
          </a>
        </p>

        <p className="legal-note">
          Weitere Anbieterangaben werden ergänzt, sobald sie feststehen. Es
          werden keine Platzhalterwerte ausgegeben.
        </p>
      </div>
    </div>
  )
}
