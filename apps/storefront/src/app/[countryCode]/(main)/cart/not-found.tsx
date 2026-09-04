import { Metadata } from "next"

import InteractiveLink from "@modules/common/components/interactive-link"

export const metadata: Metadata = {
  title: "404",
  description: "Die aufgerufene Seite gibt es nicht.",
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
<h1 className="text-2xl-semi text-ui-fg-base">Seite nicht gefunden</h1>
      <p className="text-small-regular text-ui-fg-base">
        Dieser Warenkorb existiert nicht. Cookies löschen und erneut versuchen.
      </p>
<InteractiveLink href="/">Zur Startseite</InteractiveLink>
    </div>
  )
}
