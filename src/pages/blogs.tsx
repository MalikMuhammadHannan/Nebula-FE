import { useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"

import type { Blog } from "@/api/blog.api"
import { useDeleteBlogMutation, useGetBlogsQuery } from "@/api/blog.api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ActionButton from "@/components/ui/ActionButton"
import { Button } from "@/components/ui/button"
import { TableStructure, type Column } from "@/components/ui/TableStructure"
import { formatDate } from "@/constants"
import { getApiErrorMessage } from "@/lib/apiError"
import type { RootState } from "@/store/store"
import AddEditBlog from "@/components/modals/add-edit-blog"
import ViewBlog from "@/components/modals/view-blog"
import ConfirmationModal from "@/components/ui/DeleteConfirmationModal"

const ITEMS_PER_PAGE = 10

const Blogs = () => {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id)
  const { data: blogs, isLoading, isFetching, refetch } = useGetBlogsQuery()
  const [deleteBlog] = useDeleteBlogMutation()

  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)

  function openAdd() {
    setSelectedBlog(null)
    setIsFormOpen(true)
  }

  function openEdit(blog: Blog) {
    setSelectedBlog(blog)
    setIsFormOpen(true)
  }

  function openView(blog: Blog) {
    setSelectedBlog(blog)
    setIsViewOpen(true)
  }

  function openDelete(blog: Blog) {
    setSelectedBlog(blog)
    setIsDeleteOpen(true)
  }

  async function handleDelete() {
    if (!selectedBlog) return

    setIsDeleting(true)
    try {
      await deleteBlog(selectedBlog.id).unwrap()
      toast.success("Blog deleted successfully")
      setIsDeleteOpen(false)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setIsDeleting(false)
    }
  }

  const allBlogs = blogs ?? []
  const totalItems = allBlogs.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
  const pagedBlogs = allBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const columns: Column<Blog>[] = [
    { key: "id", title: "ID", dataIndex: "id", width: "60px" },
    {
      key: "image_url",
      title: "Image",
      dataIndex: "image_url",
      width: "80px",
      render: (value) =>
        value ? (
          <img
            src={value as string}
            alt="thumbnail"
            className="h-10 w-10 rounded-md object-cover"
          />
        ) : (
          <span className="text-neutral-400">—</span>
        ),
    },
    {
      key: "title",
      title: "Title",
      dataIndex: "title",
      width: "220px",
      tooltip: true,
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
      width: "320px",
      tooltip: true,
    },
    {
      key: "created_at",
      title: "Created At",
      dataIndex: "created_at",
      width: "140px",
      render: (value) => formatDate(value as string),
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "id",
      width: "120px",
      align: "center",
      render: (_value, record) => (
        <div className="flex items-center justify-center gap-2">
          <ActionButton type="view" title="View" onClick={() => openView(record)} />
          {record.author_id === currentUserId && (
            <>
              <ActionButton type="edit" title="Edit" onClick={() => openEdit(record)} />
              <ActionButton
                type="delete"
                title="Delete"
                onClick={() => openDelete(record)}
              />
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Blogs</CardTitle>
        <Button onClick={openAdd}>Add Blog</Button>
      </CardHeader>
      <CardContent>
        <TableStructure
          columns={columns}
          data={pagedBlogs}
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

      <AddEditBlog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        blog={selectedBlog}
      />
      <ViewBlog
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        blog={selectedBlog}
      />
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSubmit={handleDelete}
        loading={isDeleting}
        type="delete"
        label={selectedBlog ? `Delete "${selectedBlog.title}"?` : undefined}
        description="This action cannot be undone."
      />
    </Card>
  )
}

export default Blogs
