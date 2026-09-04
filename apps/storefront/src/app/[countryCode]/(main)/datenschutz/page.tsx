import { Metadata } from "next"

import { shopContent } from "@lib/content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung des Bootlabs-Shops.",
}

export default function DatenschutzPage() {
  return (
    <div className="legal-page">
      <div className="content-container">
        <p className="kicker">RECHTLICHES</p>
        <h1>Datenschutzerklärung</h1>
        <p>Stand: {shopContent.legal.lastUpdated}</p>

        <h2>Verantwortliche Stelle</h2>
        <p>
          Für die Verarbeitung personenbezogener Daten in diesem Shop ist die
          unter <LocalizedClientLink href="/impressum">Impressum</LocalizedClientLink>{" "}
          genannte Stelle verantwortlich. Kontakt:{" "}
          <a href={`mailto:${shopContent.legal.email}`}>
            {shopContent.legal.email}
          </a>
          .
        </p>

        <h2>Hinweise zur Datenverarbeitung</h2>
        <p>
          Der Shop verarbeitet die Daten, die für Bestellung, Konto und Versand
          nötig sind: Name, Adresse, E-Mail, optional Telefon, Warenkorb und
          Zahlungsabwicklung. Schriften werden mit der Seite selbst ausgeliefert.
        </p>

        <h2>Bestellung und Konto</h2>
        <p>
          Wenn du bestellst oder ein Konto anlegst, verarbeiten wir die Angaben
          zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO). Zahlungen laufen
          über den angebundenen Zahlungsdienstleister, sobald der Checkout
          freigeschaltet ist.
        </p>
        <p>
          Die Angaben werden nur so lange gespeichert, wie es für die Bearbeitung
          und gesetzliche Aufbewahrung nötig ist.
        </p>

        <h2>Hosting</h2>
        <p>
          Beim Aufruf der Seiten werden technisch erforderliche Server-Logdaten
          verarbeitet (IP-Adresse, Zeitpunkt, aufgerufene Datei, User-Agent). Das
          ist nötig, um den Shop auszuliefern und die IT-Sicherheit zu
          gewährleisten (Art. 6 Abs. 1 lit. f DSGVO).
        </p>

        <h2>Deine Rechte</h2>
        <p>
          Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung
          der Verarbeitung, Datenübertragbarkeit und Widerspruch. Einwilligungen
          kannst du jederzeit widerrufen. Außerdem besteht ein Beschwerderecht
          bei einer Datenschutzaufsichtsbehörde.
        </p>
      </div>
    </div>
  )
}
