import { Plus } from "lucide-react"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { toast } from "sonner"

import type { Blog } from "@/api/blog.api"
import {
  useDeleteSessionMutation,
  useGetAllSessionsQuery,
  useQueryDocumentMutation,
  useUploadDocumentMutation,
  type DocumentSession,
} from "@/api/document.api"
import ActionButton from "@/components/ui/ActionButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ConfirmationModal from "@/components/ui/DeleteConfirmationModal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/constants"
import { getApiErrorMessage } from "@/lib/apiError"
import { cn } from "@/lib/utils"

const DocumentBlogs = () => {
  const [file, setFile] = useState<File | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Blog[]>([])
  const [deleteTarget, setDeleteTarget] = useState<DocumentSession | null>(null)

  const { data: sessions, isLoading: isLoadingSessions } = useGetAllSessionsQuery()
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation()
  const [queryDocument, { isLoading: isQuerying }] = useQueryDocumentMutation()
  const [deleteSession, { isLoading: isDeleting }] = useDeleteSessionMutation()

  function handleSelectSession(session_id: string) {
    setSessionId(session_id)
    setResults([])
  }

  function handleNewChat() {
    setSessionId(null)
    setFile(null)
    setQuery("")
    setResults([])
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
      setResults([])
      toast.success("Document uploaded successfully")
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  async function handleQuery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!sessionId || !query.trim()) return

    try {
      const blogs = await queryDocument({ session_id: sessionId, query }).unwrap()
      setResults(blogs)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <div className="flex gap-6">
      <Card className="h-fit w-64 shrink-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sessions</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={handleNewChat}>
            <Plus className="size-4" />
            New
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {isLoadingSessions ? (
            <p className="text-xs text-muted-foreground">Loading…</p>
          ) : !sessions?.length ? (
            <p className="text-xs text-muted-foreground">No documents uploaded yet.</p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.session_id}
                className={cn(
                  "flex items-center gap-1 rounded-lg pr-1 transition-colors hover:bg-muted",
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

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="document">Document</Label>
                <Input id="document" type="file" onChange={handleFileChange} required />
              </div>
              <div>
                <Button type="submit" disabled={!file || isUploading}>
                  {isUploading ? "Uploading…" : "Upload"}
                </Button>
              </div>
              {sessionId && (
                <p className="text-xs text-muted-foreground">
                  Document ready — session {sessionId}
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {sessionId && (
          <Card>
            <CardHeader>
              <CardTitle>Ask about your document</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleQuery} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="query">Query</Label>
                  <Textarea
                    id="query"
                    required
                    rows={3}
                    placeholder="Generate a blog post about..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <div>
                  <Button type="submit" disabled={!query.trim() || isQuerying}>
                    {isQuerying ? "Generating…" : "Generate"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {results.length > 0 && (
          <div className="flex flex-col gap-4">
            {results.map((blog) => (
              <Card key={blog.id}>
                <CardHeader>
                  <CardTitle>{blog.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">{blog.description}</p>
                  <p className="whitespace-pre-wrap text-sm text-foreground">{blog.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onSubmit={handleDeleteSession}
        loading={isDeleting}
        type="delete"
        label={deleteTarget ? `Delete "${deleteTarget.filename}"?` : undefined}
        description="This action cannot be undone."
      />
    </div>
  )
}

export default DocumentBlogs