import { useState } from "react"
import { toast } from "sonner"

import { useCreateCheckoutSessionMutation, useGetTokenPackagesQuery } from "@/api/billing.api"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/Modal"
import { getApiErrorMessage } from "@/lib/apiError"

interface BuyTokensModalProps {
  isOpen: boolean
  onClose: () => void
}

const BuyTokensModal = ({ isOpen, onClose }: BuyTokensModalProps) => {
  const { data: packages, isLoading } = useGetTokenPackagesQuery(undefined, { skip: !isOpen })
  const [createCheckoutSession, { isLoading: isRedirecting }] = useCreateCheckoutSessionMutation()
  const [pendingPackage, setPendingPackage] = useState<string | null>(null)

  async function handleBuy(packageKey: string) {
    setPendingPackage(packageKey)
    try {
      const result = await createCheckoutSession({ package: packageKey }).unwrap()
      window.location.href = result.checkout_url
    } catch (error) {
      toast.error(getApiErrorMessage(error))
      setPendingPackage(null)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buy AI tokens" size="lg" showCloseIcon>
      <div className="flex flex-col gap-3 py-1">
        <p className="text-sm text-muted-foreground">
          Tokens power AI blog generation and document Q&amp;A. Pick a package to top up.
        </p>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading packages…</p>
        ) : (
          <div className="flex flex-col gap-2">
            {packages?.map((pkg) => (
              <div
                key={pkg.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground capitalize">{pkg.key}</p>
                  <p className="text-xs text-muted-foreground">{pkg.tokens.toLocaleString()} tokens</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  disabled={isRedirecting}
                  loading={isRedirecting && pendingPackage === pkg.key}
                  onClick={() => handleBuy(pkg.key)}
                >
                  ${pkg.amount}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default BuyTokensModal
