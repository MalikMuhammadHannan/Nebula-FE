import { ArrowDown, Loader2, Plus, SendHorizontal, Upload } from "lucide-react"
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type UIEvent,
} from "react"
import { toast } from "sonner"

import {
  useDeleteSessionMutation,
  useGetAllSessionsQuery,
  useGetChatHistoryQuery,
  useQueryDocumentMutation,
  useUploadDocumentMutation,
  type DocumentSession,
} from "@/api/document.api"
import ActionButton from "@/components/ui/ActionButton"
import BuyTokensModal from "@/components/modals/buy-tokens"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ConfirmationModal from "@/components/ui/DeleteConfirmationModal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Shimmer from "@/components/ui/Shimmer"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/constants"
import { getApiErrorMessage, isInsufficientTokensError } from "@/lib/apiError"
import { cn } from "@/lib/utils"

const DocumentBlogs = () => {
  const [file, setFile] = useState<File | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [pendingQuery, setPendingQuery] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DocumentSession | null>(null)
  const [buyTokensOpen, setBuyTokensOpen] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)

  const { data: sessions, isLoading: isLoadingSessions } = useGetAllSessionsQuery()
  const { data: history, isLoading: isLoadingHistory } = useGetChatHistoryQuery(sessionId ?? "", {
    skip: !sessionId,
  })
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation()
  const [queryDocument, { isLoading: isQuerying }] = useQueryDocumentMutation()
  const [deleteSession, { isLoading: isDeleting }] = useDeleteSessionMutation()

  useEffect(() => {
    if (isAtBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [history, pendingQuery])

  function scrollToBottom() {
    isAtBottomRef.current = true
    setShowScrollButton(false)
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const el = event.currentTarget
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    isAtBottomRef.current = atBottom
    setShowScrollButton(!atBottom)
  }

  function handleSelectSession(session_id: string) {
    setSessionId(session_id)
    isAtBottomRef.current = true
    setShowScrollButton(false)
  }

  function handleNewChat() {
    setSessionId(null)
    setFile(null)
    setQuery("")
    setPendingQuery(null)
    isAtBottomRef.current = true
    setShowScrollButton(false)
  }

  async function handleDeleteSession() {
    if (!deleteTarget) return

    try {
      await deleteSession(deleteTarget.session_id).unwrap()
      toast.success("Session deleted successfully")
      if (sessionId === deleteTarget.session_id) handleNewChat()
      setDeleteTarget(null)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null)
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("file", file)
      const { session_id } = await uploadDocument(formData).unwrap()
      setSessionId(session_id)
      setFile(null)
      toast.success("Document uploaded successfully")
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  async function handleQuery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!sessionId || !trimmed) return

    setQuery("")
    setPendingQuery(trimmed)
    scrollToBottom()
    try {
      await queryDocument({ session_id: sessionId, query: trimmed }).unwrap()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
      setQuery(trimmed)
      if (isInsufficientTokensError(error)) {
        setBuyTokensOpen(true)
      }
    } finally {
      setPendingQuery(null)
    }
  }

  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div className="flex h-[calc(100svh-7rem)] gap-6">
      <Card className="flex h-full w-64 shrink-0 flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sessions</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={handleNewChat}>
            <Plus className="size-4" />
            New
          </Button>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-1 overflow-y-auto scroll-container">
          {isLoadingSessions ? (
            Array.from({ length: 5 }, (_, index) => (
              <Shimmer key={index} className="h-14" height={55} />
            ))
          ) : !sessions?.length ? (
            <p className="text-xs text-muted-foreground">No documents uploaded yet.</p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.session_id}
                className={cn(
                  "flex items-center gap-1 rounded-lg pr-1 cursor-pointer transition-colors hover:bg-muted",
                  sessionId === session.session_id && "bg-muted"
                )}
              >
                <button
                  type="button"
                  onClick={() => handleSelectSession(session.session_id)}
                  className="flex min-w-0 flex-1 flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 text-left"
                >
                  <span className="w-full truncate text-sm font-medium text-foreground">
                    {session.filename}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(session.created_at)}
                  </span>
                </button>
                <ActionButton
                  type="delete"
                  title="Delete session"
                  onClick={() => setDeleteTarget(session)}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="flex h-full min-w-0 flex-1 flex-col">
        {!sessionId ? (
          <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Upload className="size-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">Upload a document to start</p>
              <p className="text-xs text-muted-foreground">
                Ask questions about it and generate blog posts grounded in its content.
              </p>
            </div>
            <form onSubmit={handleUpload} className="flex w-full max-w-sm flex-col gap-3">
              <div className="flex flex-col gap-1.5 text-left">
                <Label htmlFor="document">Document</Label>
                <Input id="document" type="file" onChange={handleFileChange} required />
              </div>
              <Button type="submit" disabled={!file || isUploading} loading={isUploading}>
                Upload
              </Button>
            </form>
          </CardContent>
        ) : (
          <>
            <div className="relative flex min-h-0 flex-1 flex-col">
              <CardContent
                ref={containerRef}
                onScroll={handleScroll}
                className="flex flex-1 flex-col gap-4 overflow-y-auto scroll-container"
              >
                {isLoadingHistory ? (
                  <p className="text-center text-sm text-muted-foreground">Loading conversation…</p>
                ) : !history?.length && !pendingQuery ? (
                  <p className="text-center text-sm text-muted-foreground">
                    Ask a question about your document to get started.
                  </p>
                ) : (
                  history?.map((turn) => (
                    <div key={turn.id} className="flex flex-col gap-2 ">
                      <div className="flex justify-end">
                        <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                          {turn.query}
                        </div>
                      </div>
                      <div className="flex justify-start">
                        {turn.blogs.length > 0 ? (
                          <div className="flex max-w-[75%] flex-col gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5">
                            <p className="text-sm font-semibold text-foreground">{turn.blogs[0].title}</p>
                            <p className="text-xs text-muted-foreground">{turn.blogs[0].description}</p>
                            <p className="whitespace-pre-wrap text-sm text-foreground">
                              {turn.blogs[0].content}
                            </p>
                          </div>
                        ) : (
                          <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2 text-sm text-muted-foreground italic">
                            No answer found in the document for this question.
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {pendingQuery && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-end">
                      <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                        {pendingQuery}
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
                        <Loader2 className="size-3.5 animate-spin" />
                        Thinking…
                      </div>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </CardContent>

              {showScrollButton && (
                <button
                  type="button"
                  onClick={scrollToBottom}
                  aria-label="Scroll to latest message"
                  className="absolute bottom-4 right-1/2 cursor-pointer flex size-9 items-center justify-center rounded-full bg-background text-foreground shadow-md ring-1 ring-border/60 transition-colors hover:bg-muted"
                >
                  <ArrowDown className="size-4" />
                </button>
              )}
            </div>

            <div className="border-t border-border/60 p-4">
              <form onSubmit={handleQuery} className="flex items-end gap-2">
                <Textarea
                  rows={1}
                  className="max-h-32 flex-1 resize-none "
                  placeholder="Ask about your document…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!query.trim() || isQuerying}
                  loading={isQuerying}
                >
                  {!isQuerying && <SendHorizontal className="size-4" />}
                </Button>
              </form>
            </div>
          </>
        )}
      </Card>

      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onSubmit={handleDeleteSession}
        loading={isDeleting}
        type="delete"
        label={deleteTarget ? `Delete "${deleteTarget.filename}"?` : undefined}
        description="This action cannot be undone."
      />

      <BuyTokensModal isOpen={buyTokensOpen} onClose={() => setBuyTokensOpen(false)} />
    </div>
  )
}

export default DocumentBlogs
