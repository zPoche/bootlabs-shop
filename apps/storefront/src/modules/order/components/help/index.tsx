import { Heading } from "@modules/common/components/ui"
import React from "react"

const Help = () => {
  return (
    <div className="mt-6">
<Heading className="text-base-semi">Hilfe nötig?</Heading>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
<a href="mailto:info@bootlabs.de">Kontakt</a>
          </li>
          <li>
            <a href="mailto:info@bootlabs.de">Rückgabe & Austausch</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
