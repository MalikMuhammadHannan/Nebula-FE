import { Heart, Loader2, Trash2 } from "lucide-react"
import { useState, type FormEvent } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { useGetPublicBlogByIdQuery } from "@/api/blog.api"
import { useCreateCommentMutation, useDeleteCommentMutation, useGetCommentsQuery } from "@/api/comment.api"
import { useLikeBlogMutation, useUnlikeBlogMutation } from "@/api/like.api"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/constants"
import { ROUTES } from "@/constants/routes"
import { getApiErrorMessage } from "@/lib/apiError"
import type { RootState } from "@/store/store"

const BlogDetail = () => {
    const { id } = useParams<{ id: string }>()
    const blogId = Number(id)
    const navigate = useNavigate()

    const currentUser = useSelector((state: RootState) => state.auth.user)
    const token = useSelector((state: RootState) => state.auth.token)

    const { data, isLoading, isFetching, isError } = useGetPublicBlogByIdQuery(blogId, {
        skip: !blogId,
    })
    const blog = data

    const { data: comments, isLoading: isLoadingComments } = useGetCommentsQuery(blogId, {
        skip: !blogId,
    })

    const [likeBlog, { isLoading: isLiking }] = useLikeBlogMutation()
    const [unlikeBlog, { isLoading: isUnliking }] = useUnlikeBlogMutation()
    const [createComment, { isLoading: isPostingComment }] = useCreateCommentMutation()
    const [deleteComment] = useDeleteCommentMutation()

    const [liked, setLiked] = useState(false)
    const [totalLikes, setTotalLikes] = useState<number | null>(null)
    const [comment, setComment] = useState("")

    function requireAuth() {
        if (token) return true
        toast.error("Please sign in to continue")
        navigate(ROUTES.SIGN_IN)
        return false
    }

    async function handleToggleLike() {
        if (!requireAuth()) return
        try {
            const result = liked ? await unlikeBlog(blogId).unwrap() : await likeBlog(blogId).unwrap()
            setLiked(!liked)
            setTotalLikes(result.total_likes)
        } catch (error) {
            toast.error(getApiErrorMessage(error))
        }
    }

    async function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!comment.trim()) return
        if (!requireAuth()) return

        try {
            await createComment({ blogId, content: comment.trim() }).unwrap()
            setComment("")
        } catch (error) {
            toast.error(getApiErrorMessage(error))
        }
    }

    async function handleDeleteComment(commentId: number) {
        try {
            await deleteComment({ commentId, blogId }).unwrap()
            toast.success("Comment deleted")
        } catch (error) {
            toast.error(getApiErrorMessage(error))
        }
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
                    disabled={isLiking || isUnliking}
                    onClick={handleToggleLike}
                >
                    {isLiking || isUnliking ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <Heart className={liked ? "fill-current" : ""} />
                    )}
                    {liked ? "Liked" : "Like"}
                </Button>
                {totalLikes !== null && (
                    <span className="text-sm text-muted-foreground">
                        {totalLikes} {totalLikes === 1 ? "like" : "likes"}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-foreground">Comments</h2>

                {isLoadingComments ? (
                    <p className="text-sm text-muted-foreground">Loading comments…</p>
                ) : comments && comments.length > 0 ? (
                    <ul className="flex flex-col gap-3">
                        {comments.map((item) => (
                            <li
                                key={item.id}
                                className="flex flex-col gap-1 rounded-lg border border-border/60 p-3"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {currentUser?.id === item.user_id ? "You" : `User #${item.user_id}`}
                                        {" · "}
                                        {formatDate(item.created_at)}
                                    </span>
                                    {currentUser?.id === item.user_id && (
                                        <button
                                            type="button"
                                            aria-label="Delete comment"
                                            className="text-muted-foreground transition-colors hover:text-destructive"
                                            onClick={() => handleDeleteComment(item.id)}
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm text-foreground">{item.content}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">No comments yet.</p>
                )}

                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
                    <Textarea
                        rows={3}
                        placeholder="Write a comment…"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                    />
                    <Button type="submit" size="sm" className="self-end" disabled={isPostingComment}>
                        {isPostingComment && <Loader2 className="animate-spin" />}
                        Post comment
                    </Button>
                </form>
            </div>
        </article>
    )
}

export default BlogDetail
