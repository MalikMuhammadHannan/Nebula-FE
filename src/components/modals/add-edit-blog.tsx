import { useEffect, useState, type FormEvent } from "react"
import { toast } from "sonner"

import type { Blog } from "@/api/blog.api"
import { useCreateBlogMutation, useUpdateBlogMutation } from "@/api/blog.api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/Modal"
import { Textarea } from "@/components/ui/textarea"
import { getApiErrorMessage } from "@/lib/apiError"

interface AddEditBlogValues {
  title: string
  description: string
  image_url: string
  content: string
}

const EMPTY_VALUES: AddEditBlogValues = {
  title: "",
  description: "",
  image_url: "",
  content: "",
}

interface AddEditBlogProps {
  isOpen: boolean
  onClose: () => void
  blog?: Blog | null
}

const AddEditBlog = ({ isOpen, onClose, blog }: AddEditBlogProps) => {
  const isEditing = Boolean(blog)
  const [values, setValues] = useState<AddEditBlogValues>(EMPTY_VALUES)
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation()
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation()
  const isSaving = isCreating || isUpdating

  useEffect(() => {
    if (isOpen) {
      setValues(
        blog
          ? {
            title: blog.title,
            description: blog.description,
            image_url: blog.image_url ?? "",
            content: blog.content,
          }
          : EMPTY_VALUES
      )
    }
  }, [isOpen, blog])

  function updateField(field: keyof AddEditBlogValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const payload = {
      title: values.title,
      description: values.description,
      image_url: values.image_url || null,
      content: values.content,
    }

    try {
      if (isEditing && blog) {
        await updateBlog({ id: blog.id, data: payload }).unwrap()
        toast.success("Blog updated successfully")
      } else {
        await createBlog(payload).unwrap()
        toast.success("Blog created successfully")
      }
      onClose()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Blog" : "Add Blog"}
      loading={isSaving}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-1">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            required
            value={values.title}
            onChange={(event) => updateField("title", event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            required
            rows={5}
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            required
            rows={5}
            value={values.content}
            onChange={(event) => updateField("content", event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            type="url"
            placeholder="https://..."
            value={values.image_url}
            onChange={(event) => updateField("image_url", event.target.value)}
          />
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddEditBlog
