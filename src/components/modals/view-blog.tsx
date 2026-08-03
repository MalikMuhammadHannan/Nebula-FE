import type { Blog } from "@/api/blog.api"
import { Modal } from "@/components/ui/Modal"
import { formatDate } from "@/constants"

interface ViewBlogProps {
  isOpen: boolean
  onClose: () => void
  blog: Blog | null
}

const ViewBlog = ({ isOpen, onClose, blog }: ViewBlogProps) => {
  if (!blog) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Blog Details" size="lg">
      <div className="flex flex-col gap-4 py-1">
        {blog.image_url && (
          <img
            src={blog.image_url}
            alt={blog.title}
            className="max-h-64 w-full rounded-lg object-cover"
          />
        )}

        <div>
          <p className="text-xs font-medium text-muted-foreground">Title</p>
          <h3 className="text-lg font-semibold text-foreground">{blog.title}</h3>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground">Description</p>
          <p className="whitespace-pre-wrap text-sm text-foreground">{blog.description}</p>
        </div>

        <div className="flex gap-6">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Author ID</p>
            <p className="text-sm text-foreground">{blog.author_id}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Created At</p>
            <p className="text-sm text-foreground">{formatDate(blog.created_at)}</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ViewBlog
