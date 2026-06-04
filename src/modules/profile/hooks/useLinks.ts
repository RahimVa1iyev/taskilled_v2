import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  useLinksQuery,
  useCreateLinkMutation,
  useDeleteLinkMutation,
} from '@/modules/profile/api/links.api'
import { linkSchema, type LinkFormData } from '@/modules/profile/schemas/link.schema'
import { toast } from '@/shared/lib/toast'

export function useLinks() {
  const { data: links = [], isLoading } = useLinksQuery()
  const { mutate: createLink, isPending: isCreating } = useCreateLinkMutation()
  const { mutate: deleteLink, isPending: isDeleting } = useDeleteLinkMutation()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const form = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: { url: '', linkType: null },
  })

  function handleCreate(data: LinkFormData) {
    createLink({ url: data.url, linkType: data.linkType ?? null }, {
      onSuccess: () => {
        toast.success('Link əlavə edildi')
        setIsFormOpen(false)
        form.reset()
      },
    })
  }

  function handleDelete(id: number) {
    deleteLink(id, {
      onSuccess: () => toast.success('Link silindi'),
    })
  }

  return {
    links,
    isLoading,
    isCreating,
    isDeleting,
    isFormOpen,
    setIsFormOpen,
    form,
    handleCreate: form.handleSubmit(handleCreate),
    handleDelete,
  }
}
