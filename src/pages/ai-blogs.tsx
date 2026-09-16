import { Loader2, Sparkles } from "lucide-react"
import { useState, type FormEvent } from "react"
import { toast } from "sonner"

import { useGenerateAiBlogMutation } from "@/api/ai-blog.api"
import type { Blog } from "@/api/blog.api"
import { BlogCard } from "@/components/home/blog-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getApiErrorMessage } from "@/lib/apiError"

const AiBlogs = () => {
  const [query, setQuery] = useState("")
  const [generatedBlogs, setGeneratedBlogs] = useState<Blog[]>([])
  const [generateAiBlog, { isLoading }] = useGenerateAiBlogMutation()

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    try {
      const blog = await generateAiBlog({ query: trimmed }).unwrap()
      setGeneratedBlogs((prev) => [blog, ...prev])
      setQuery("")
      toast.success("Blog generated successfully")
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate a blog with AI</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <Textarea
              rows={3}
              placeholder="What should the blog be about?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={isLoading}
            />
            <div>
              <Button type="submit" disabled={!query.trim() || isLoading} loading={isLoading}>
                <Sparkles className="size-4" />
                {isLoading ? "Generating…" : "Generate"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Generating your blog — this can take a moment…
          </CardContent>
        </Card>
      )}

      {generatedBlogs.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Sparkles className="size-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">No blogs generated yet</p>
              <p className="text-xs text-muted-foreground">
                Describe a topic above and let AI write and publish a post for you.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        generatedBlogs.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2">
            {generatedBlogs.map((blog, index) => (
              <BlogCard key={blog.id} post={blog} index={index} />
            ))}
          </div>
        )
      )}
    </div>
  )
}

export default AiBlogs
