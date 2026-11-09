import { Coins, FileText, Newspaper, PenSquare, Sparkles, Users } from "lucide-react"
import { useState, type ReactNode } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { useGetTokenBalanceQuery } from "@/api/billing.api"
import { useGetBlogsQuery } from "@/api/blog.api"
import { useGetAllUsersQuery } from "@/api/user.api"
import BuyTokensModal from "@/components/modals/buy-tokens"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/constants"
import { ROUTES } from "@/constants/routes"
import { stripHtml } from "@/lib/html"
import type { RootState } from "@/store/store"

const RECENT_LIMIT = 5

interface StatCardProps {
    label: string
    value: number | undefined
    icon: ReactNode
    loading: boolean
    action?: ReactNode
}

const StatCard = ({ label, value, icon, loading, action }: StatCardProps) => (
    <Card>
        <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {icon}
                </span>
            </div>
            <div className="flex items-end justify-between gap-2">
                <span className="font-heading text-3xl font-semibold text-foreground">
                    {loading ? <span className="inline-block h-8 w-12 animate-pulse rounded bg-muted" /> : (value ?? 0)}
                </span>
                {action}
            </div>
        </CardContent>
    </Card>
)

const QUICK_ACTIONS = [
    { to: ROUTES.BLOGS, icon: <PenSquare size={18} />, title: "Write a blog", text: "Create or manage your posts" },
    { to: ROUTES.AI_GENERATOR, icon: <Sparkles size={18} />, title: "AI Blogs", text: "Generate a post from a topic" },
    { to: ROUTES.DOCUMENTS_GENERATOR, icon: <FileText size={18} />, title: "Document Blogs", text: "Turn a document into a post" },
]

const Dashboard = () => {
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.auth.user)
    const isAdmin = user?.role?.toUpperCase() === "ADMIN"

    const { data: blogs, isLoading: isLoadingBlogs } = useGetBlogsQuery()
    const { data: balance, isLoading: isLoadingBalance } = useGetTokenBalanceQuery()
    const { data: users, isLoading: isLoadingUsers } = useGetAllUsersQuery(undefined, { skip: !isAdmin })

    const [isBuyOpen, setIsBuyOpen] = useState(false)

    const allBlogs = blogs ?? []
    const myBlogs = allBlogs.filter((blog) => blog.author_id === user?.id)
    const recentBlogs = [...myBlogs]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, RECENT_LIMIT)

    const firstName = user?.full_name?.split(" ")[0]

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="font-heading text-2xl font-semibold text-foreground">
                    Welcome back{firstName ? `, ${firstName}` : ""} 👋
                </h1>
                <p className="text-sm text-muted-foreground">Here's what's happening with your blog.</p>
            </div>

            <div className={`grid gap-4 sm:grid-cols-2 ${isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
                <StatCard label="My posts" value={myBlogs.length} icon={<PenSquare size={16} />} loading={isLoadingBlogs} />
                <StatCard label="All posts" value={allBlogs.length} icon={<Newspaper size={16} />} loading={isLoadingBlogs} />
                <StatCard
                    label="AI tokens"
                    value={balance?.token_balance}
                    icon={<Coins size={16} />}
                    loading={isLoadingBalance}
                    action={
                        <Button size="sm" variant="outline" onClick={() => setIsBuyOpen(true)}>
                            Buy tokens
                        </Button>
                    }
                />
                {isAdmin && (
                    <StatCard label="Users" value={users?.length} icon={<Users size={16} />} loading={isLoadingUsers} />
                )}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <CardTitle>Recent posts</CardTitle>
                            <CardDescription>Your latest {RECENT_LIMIT} posts</CardDescription>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => navigate(ROUTES.BLOGS)}>
                            View all
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {isLoadingBlogs ? (
                            <div className="flex flex-col gap-3">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="h-14 animate-pulse rounded-lg bg-muted" />
                                ))}
                            </div>
                        ) : recentBlogs.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 py-8 text-center">
                                <p className="text-sm text-muted-foreground">You haven't written any posts yet.</p>
                                <Button size="sm" onClick={() => navigate(ROUTES.BLOGS)}>
                                    Write your first post
                                </Button>
                            </div>
                        ) : (
                            <ul className="flex flex-col divide-y divide-border/60">
                                {recentBlogs.map((blog) => (
                                    <li key={blog.id}>
                                        <Link
                                            to={ROUTES.BLOG.replace(":id", String(blog.id))}
                                            className="flex items-center gap-3 py-3 transition-colors hover:text-primary"
                                        >
                                            {blog.image_url ? (
                                                <img
                                                    src={blog.image_url}
                                                    alt=""
                                                    className="size-10 shrink-0 rounded-md object-cover"
                                                />
                                            ) : (
                                                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                                    <Newspaper size={16} />
                                                </span>
                                            )}
                                            <div className="flex min-w-0 flex-1 flex-col">
                                                <span className="truncate text-sm font-medium">{stripHtml(blog.title)}</span>
                                                <span className="truncate text-xs text-muted-foreground">
                                                    {stripHtml(blog.description)}
                                                </span>
                                            </div>
                                            <span className="shrink-0 text-xs text-muted-foreground">
                                                {formatDate(blog.created_at)}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick actions</CardTitle>
                        <CardDescription>Jump right in</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {QUICK_ACTIONS.map((action) => (
                            <Link
                                key={action.to}
                                to={action.to}
                                className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
                            >
                                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    {action.icon}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-foreground">{action.title}</span>
                                    <span className="text-xs text-muted-foreground">{action.text}</span>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <BuyTokensModal isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
        </div>
    )
}

export default Dashboard
