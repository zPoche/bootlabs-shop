"use client"

import {
  COMPONENT_TYPES,
  evaluateCompatibility,
  estimatePricePreview,
  formatEuro,
  SYSTEM_PRESETS,
  type ComponentRecord,
  type ComponentType,
  type ConfigurationSnapshot,
} from "@bootlabs/configurator"
import { addToCart } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useMemo, useState } from "react"
import { useParams } from "next/navigation"

const LABELS: Record<ComponentType, string> = {
  cpu: "Prozessor",
  mainboard: "Mainboard",
  ram: "Arbeitsspeicher",
  gpu: "Grafikkarte",
  cooler: "Kühler",
  case: "Gehäuse",
  psu: "Netzteil",
  ssd: "SSD",
  os: "Betriebssystem",
  accessory: "Zubehör",
}

type Props = {
  components: ComponentRecord[]
  customVariantId?: string
  createConfiguration: (
    componentIds: string[]
  ) => Promise<ConfigurationSnapshot>
}

export default function ConfiguratorForm({
  components,
  customVariantId,
  createConfiguration,
}: Props) {
  const countryCode = useParams().countryCode as string
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const preset = SYSTEM_PRESETS[0]
    return Object.fromEntries(
      (preset?.componentIds ?? []).map((id) => {
        const item = components.find((component) => component.id === id)
        return [item?.type ?? id, id]
      })
    )
  })
  const [snapshot, setSnapshot] = useState<ConfigurationSnapshot | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const selectedRecords = useMemo(
    () =>
      COMPONENT_TYPES.map((type) =>
        components.find((item) => item.id === selected[type])
      ).filter((item): item is ComponentRecord => Boolean(item)),
    [components, selected]
  )

  const preview = evaluateCompatibility(selectedRecords)
  const price = estimatePricePreview(selectedRecords)

  const applyPreset = (id: string) => {
    const preset = SYSTEM_PRESETS.find((item) => item.id === id)
    if (!preset) return
    const next: Record<string, string> = {}
    for (const componentId of preset.componentIds) {
      const item = components.find((component) => component.id === componentId)
      if (item) next[item.type] = item.id
    }
    setSelected(next)
    setSnapshot(null)
  }

  const submit = async () => {
    setBusy(true)
    setMessage(null)
    try {
      const created = await createConfiguration(
        selectedRecords.map((item) => item.id)
      )
      setSnapshot(created)
      if (!created.compatibility.ok) {
        setMessage("Die Konfiguration hat Blocker. Bitte Teile anpassen.")
        return
      }
      if (!customVariantId) {
        setMessage(
          "Konfiguration geprüft. Katalog-Seed fehlt noch — danach liegt der PC im Warenkorb."
        )
        return
      }
      await addToCart({
        variantId: customVariantId,
        quantity: 1,
        countryCode,
        metadata: { configuration_id: created.id },
        unitPrice: created.calculatedPriceCents / 100,
      })
      setMessage("Geprüft und in den Warenkorb gelegt.")
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Konfiguration fehlgeschlagen."
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="configurator">
      <div className="configurator-presets">
        {SYSTEM_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="button button-ghost"
            onClick={() => applyPreset(preset.id)}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="configurator-grid">
        {COMPONENT_TYPES.map((type) => {
          const options = components.filter((item) => item.type === type)
          if (options.length === 0) return null
          return (
            <label key={type} className="configurator-field">
              <span>{LABELS[type]}</span>
              <select
                value={selected[type] ?? ""}
                onChange={(event) =>
                  setSelected((current) => ({
                    ...current,
                    [type]: event.target.value,
                  }))
                }
              >
                <option value="">Keine Auswahl</option>
                {options.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          )
        })}
      </div>

      <aside className="configurator-summary">
        <p className="kicker">PRÜFUNG</p>
        <h2>Serverseitiger Festpreis</h2>
        <p className="system-price">{formatEuro(price.totalCents)}</p>
        <p className="system-meta">
          Vorschau im Browser. Verbindlich wird der Preis erst nach Prüfung.
        </p>
        <p className="system-meta">
          Leistung ca. {preview.estimatedPowerWatt} W ·{" "}
          {preview.ok ? "kompatibel" : "hat Blocker"}
        </p>
        {preview.issues.length > 0 ? (
          <ul className="configurator-issues">
            {preview.issues.map((issue) => (
              <li key={`${issue.ruleId}-${issue.message}`} data-severity={issue.severity}>
                {issue.severity === "block" ? "Blocker" : "Hinweis"}: {issue.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>Alle Pflichtregeln sind grün.</p>
        )}
        <button
          type="button"
          className="button button-primary"
          onClick={submit}
          disabled={busy || selectedRecords.length === 0}
        >
          {busy ? "Prüfen …" : "Prüfen und in den Warenkorb"}
        </button>
        {snapshot ? (
          <p className="system-meta">
            Referenz {snapshot.publicReference} ·{" "}
            {formatEuro(snapshot.calculatedPriceCents)}
          </p>
        ) : null}
        {message ? <p>{message}</p> : null}
        <LocalizedClientLink className="button button-ghost" href="/cart">
          Zum Warenkorb
        </LocalizedClientLink>
      </aside>
    </div>
  )
}
