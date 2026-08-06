import { Heart } from "lucide-react"
import { useState, type FormEvent } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"

import { useGetPublicBlogByIdQuery } from "@/api/blog.api"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/constants"
import { ROUTES } from "@/constants/routes"

const BlogDetail = () => {
    const { id } = useParams<{ id: string }>()
    const blogId = Number(id)
    const { data, isLoading, isFetching, isError } = useGetPublicBlogByIdQuery(blogId, {
        skip: !blogId,
    })
    const blog = data

    const [liked, setLiked] = useState(false)
    const [comment, setComment] = useState("")

    function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!comment.trim()) return
        toast.info("Comments are coming soon")
        setComment("")
    }

    if (isLoading || isFetching) {
        return <Loading />
    }

    if (isError || !blog) {
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-muted-foreground">This blog post could not be found.</p>
                <Button asChild variant="outline">
                    <Link to={ROUTES.LANDING}>Back home</Link>
                </Button>
            </div>
        )
    }

    return (
        <article className="mx-auto flex max-w-3xl flex-col gap-6 pb-16">
            <Link to={ROUTES.LANDING} className="text-sm font-medium text-gradient-brand">
                ← Back to posts
            </Link>

            {blog.image_url && (
                <div className="aspect-video overflow-hidden rounded-2xl">
                    <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="size-full object-cover"
                    />
                </div>
            )}

            <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-muted-foreground">
                    {formatDate(blog.created_at)}
                </p>
                <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                    {blog.title}
                </h1>
                <p className="text-muted-foreground">{blog.description}</p>
            </div>

            <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {blog.content}
            </div>

            <div className="flex items-center gap-3 border-y border-border/60 py-4">
                <Button
                    type="button"
                    variant={liked ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLiked((prev) => !prev)}
                >
                    <Heart className={liked ? "fill-current" : ""} />
                    {liked ? "Liked" : "Like"}
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-foreground">Comments</h2>

                <p className="text-sm text-muted-foreground">No comments yet.</p>

                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
                    <Textarea
                        rows={3}
                        placeholder="Write a comment…"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                    />
                    <Button type="submit" size="sm" className="self-end">
                        Post comment
                    </Button>
                </form>
            </div>
        </article>
    )
}

export default BlogDetail
