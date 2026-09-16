import { Search, ShieldAlert } from "lucide-react"
import { useState, type FormEvent } from "react"
import { toast } from "sonner"

import {
  useActivateUserMutation,
  useDeactivateUserMutation,
  useFindUsersByQueryMutation,
  useGetAllUsersQuery,
  type AdminUser,
  type AssistantResult,
  type UserAction,
} from "@/api/user.api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ConfirmationModal from "@/components/ui/DeleteConfirmationModal"
import { TableStructure, type Column } from "@/components/ui/TableStructure"
import { Textarea } from "@/components/ui/textarea"
import { getApiErrorMessage } from "@/lib/apiError"
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 10

const AdminUsers = () => {
  const { data: users, isLoading, isFetching, refetch } = useGetAllUsersQuery()
  const [findUsers, { isLoading: isSearching }] = useFindUsersByQueryMutation()
  const [deactivateUser, { isLoading: isDeactivating }] = useDeactivateUserMutation()
  const [activateUser, { isLoading: isActivating }] = useActivateUserMutation()
  const isApplyingAction = isDeactivating || isActivating

  const [query, setQuery] = useState("")
  const [assistantResult, setAssistantResult] = useState<AssistantResult | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<{ user: AdminUser; action: UserAction } | null>(
    null
  )
  const [currentPage, setCurrentPage] = useState(1)

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    try {
      const result = await findUsers({ query: trimmed }).unwrap()
      setAssistantResult(result)
    } catch (error) {
      setAssistantResult(null)
      toast.error(getApiErrorMessage(error))
    }
  }

  function actionForMatch(match: AdminUser): UserAction {
    if (assistantResult?.action === "activate" || assistantResult?.action === "deactivate") {
      return assistantResult.action
    }
    return match.is_active ? "deactivate" : "activate"
  }

  async function handleConfirmAction() {
    if (!confirmTarget) return

    try {
      const mutate = confirmTarget.action === "activate" ? activateUser : deactivateUser
      await mutate(confirmTarget.user.id).unwrap()
      toast.success(
        `${confirmTarget.user.full_name} was ${confirmTarget.action === "activate" ? "activated" : "deactivated"}`
      )
      setConfirmTarget(null)
      setAssistantResult(null)
      setQuery("")
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  const allUsers = users ?? []
  const totalItems = allUsers.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
  const pagedUsers = allUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const columns: Column<AdminUser>[] = [
    { key: "id", title: "ID", dataIndex: "id", width: "60px" },
    { key: "full_name", title: "Name", dataIndex: "full_name", width: "200px", tooltip: true },
    { key: "email", title: "Email", dataIndex: "email", width: "240px", tooltip: true },
    {
      key: "role",
      title: "Role",
      dataIndex: "role",
      width: "100px",
      render: (value) => (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground capitalize">
          {value as string}
        </span>
      ),
    },
    {
      key: "is_active",
      title: "Status",
      dataIndex: "is_active",
      width: "100px",
      render: (value) => (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            value ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"
          )}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-muted-foreground" />
            Find a user
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-xs text-muted-foreground">
            Describe who you&apos;re looking for and the assistant will find their account.
          </p>

          <form onSubmit={handleSearch} className="flex items-end gap-2">
            <Textarea
              rows={1}
              className="max-h-32 flex-1 resize-none"
              placeholder="e.g. Jane Doe"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Button type="submit" disabled={!query.trim() || isSearching} loading={isSearching}>
              <Search className="size-4" />
              Find
            </Button>
          </form>

          {assistantResult && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">{assistantResult.message}</p>

              {assistantResult.matches.map((match) => {
                const action = actionForMatch(match)
                return (
                  <div
                    key={match.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3"
                  >
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold text-foreground">{match.full_name}</p>
                      <p className="text-xs text-muted-foreground">{match.email}</p>
                      <span
                        className={cn(
                          "mt-1 w-fit rounded-full px-2 py-0.5 text-xs font-medium",
                          match.is_active
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-destructive/10 text-destructive"
                        )}
                      >
                        {match.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant={action === "deactivate" ? "destructive" : "default"}
                      size="sm"
                      onClick={() => setConfirmTarget({ user: match, action })}
                    >
                      {action === "activate" ? "Activate" : "Deactivate"}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <TableStructure
            columns={columns}
            data={pagedUsers}
            rowKey="id"
            loading={isLoading || isFetching}
            refreshData={refetch}
            pagination={{
              currentPage,
              totalPages,
              totalItems,
              itemsPerPage: ITEMS_PER_PAGE,
              onPageChange: setCurrentPage,
            }}
          />
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onSubmit={handleConfirmAction}
        loading={isApplyingAction}
        type={confirmTarget?.action === "activate" ? "verify" : "delete"}
        label={
          confirmTarget
            ? `${confirmTarget.action === "activate" ? "Activate" : "Deactivate"} "${confirmTarget.user.full_name}"?`
            : undefined
        }
        description={
          confirmTarget?.action === "activate"
            ? "They will be able to sign in again."
            : "They will no longer be able to sign in until reactivated."
        }
      />
    </div>
  )
}

export default AdminUsers
