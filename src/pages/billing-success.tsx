import { useEffect, useRef } from "react"
import { CheckCircle2, Loader2, RefreshCw } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"

import { useGetTokenBalanceQuery, useVerifyCheckoutSessionMutation } from "@/api/billing.api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ROUTES } from "@/constants/routes"

const BillingSuccess = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const { data, isFetching, refetch } = useGetTokenBalanceQuery()
  const [verifySession, { data: verified, isLoading: isVerifying, isError }] =
    useVerifyCheckoutSessionMutation()

  const requested = useRef(false)
  useEffect(() => {
    if (sessionId && !requested.current) {
      requested.current = true
      verifySession(sessionId)
    }
  }, [sessionId, verifySession])

  const credited = verified?.status === "completed"
  const balance = verified?.token_balance ?? data?.token_balance

  let message = "Your tokens will be added to your account shortly."
  if (isVerifying) message = "Confirming your payment…"
  else if (credited) message = "Your tokens have been added to your account."
  else if (isError) message = "We couldn't confirm your payment yet. Refresh in a moment."

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 className="size-7 text-emerald-600" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Payment successful</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Current balance</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => (sessionId ? verifySession(sessionId) : refetch())}
            disabled={isFetching || isVerifying}
            aria-label="Refresh balance"
          >
            <RefreshCw className={isFetching || isVerifying ? "size-3.5 animate-spin" : "size-3.5"} />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="flex items-center justify-center text-2xl font-semibold text-foreground">
            {isVerifying ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : balance !== undefined ? (
              balance.toLocaleString()
            ) : (
              "—"
            )}
          </p>
          <p className="text-xs text-muted-foreground">tokens</p>
        </CardContent>
      </Card>

      <Button asChild>
        <Link to={ROUTES.DASHBOARD}>Back to dashboard</Link>
      </Button>
    </div>
  )
}

export default BillingSuccess
