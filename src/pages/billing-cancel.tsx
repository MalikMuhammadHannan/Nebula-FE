import { XCircle } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"

const BillingCancel = () => {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <XCircle className="size-7 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Checkout cancelled</h1>
        <p className="text-sm text-muted-foreground">No charge was made. You can try again anytime.</p>
      </div>
      <Button asChild variant="outline">
        <Link to={ROUTES.DASHBOARD}>Back to dashboard</Link>
      </Button>
    </div>
  )
}

export default BillingCancel
