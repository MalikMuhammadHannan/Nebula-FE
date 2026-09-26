import { CheckCircle2, RefreshCw } from "lucide-react"
import { Link } from "react-router-dom"

import { useGetTokenBalanceQuery } from "@/api/billing.api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ROUTES } from "@/constants/routes"

const BillingSuccess = () => {
  const { data, isFetching, refetch } = useGetTokenBalanceQuery()

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 className="size-7 text-emerald-600" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Payment successful</h1>
        <p className="text-sm text-muted-foreground">
          Your tokens will be added to your account shortly.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Current balance</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh balance"
          >
            <RefreshCw className={isFetching ? "size-3.5 animate-spin" : "size-3.5"} />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-foreground">
            {data ? data.token_balance.toLocaleString() : "—"}
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
