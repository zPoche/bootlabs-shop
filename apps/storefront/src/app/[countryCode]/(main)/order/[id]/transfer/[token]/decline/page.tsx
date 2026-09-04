import { declineTransferRequest } from "@lib/data/orders"
import { Heading, Text } from "@modules/common/components/ui"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  const { success, error } = await declineTransferRequest(id, token)

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        {success && (
          <>
            <Heading level="h1" className="text-xl text-zinc-900">
              Übertragung abgelehnt
            </Heading>
            <Text className="text-ui-fg-subtle">
              Die Übertragung von Bestellung {id} wurde abgelehnt.
            </Text>
          </>
        )}
        {!success && (
          <>
            <Text className="text-ui-fg-subtle">
              Die Übertragung konnte nicht abgelehnt werden. Bitte erneut
              versuchen.
            </Text>
            {error && (
              <Text className="text-red-500">Fehlermeldung: {error}</Text>
            )}
          </>
        )}
      </div>
    </div>
  )
}
