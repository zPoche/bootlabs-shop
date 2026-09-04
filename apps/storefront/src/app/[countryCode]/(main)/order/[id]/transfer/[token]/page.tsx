import { Heading, Text } from "@modules/common/components/ui"
import TransferActions from "@modules/order/components/transfer-actions"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <Heading level="h1" className="text-xl text-zinc-900">
          Übertragungsanfrage für Bestellung {id}
        </Heading>
        <Text className="text-ui-fg-subtle">
          Es gibt eine Anfrage, die Bestellung ({id}) an ein anderes Konto zu
          übertragen. Wenn du einverstanden bist, bestätige das unten.
        </Text>
        <div className="w-full h-px bg-white/10" />
        <Text className="text-ui-fg-subtle">
          Nach der Annahme übernimmt das neue Konto alle Rechte an dieser
          Bestellung.
        </Text>
        <Text className="text-ui-fg-subtle">
          Wenn du die Anfrage nicht kennst, musst du nichts tun.
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <TransferActions id={id} token={token} />
      </div>
    </div>
  )
}
