import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  useExperienceQuery,
  useCreateExperienceMutation,
  useDeleteExperienceMutation,
} from '@/modules/profile/api/experience.api'
import { experienceSchema, type ExperienceFormData } from '@/modules/profile/schemas/experience.schema'
import { toast } from '@/shared/lib/toast'

export function useExperience() {
  const { data: experiences = [], isLoading } = useExperienceQuery()
  const { mutate: create, isPending: isCreating } = useCreateExperienceMutation()
  const { mutate: remove, isPending: isDeleting } = useDeleteExperienceMutation()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: '',
      position: '',
      startDate: '',
      endDate: null,
      description: null,
    },
  })

  function handleCreate(data: ExperienceFormData) {
    create(data, {
      onSuccess: () => {
        toast.success('Təcrübə əlavə edildi')
        setIsFormOpen(false)
        form.reset()
      },
    })
  }

  function handleDelete(id: number) {
    remove(id, {
      onSuccess: () => toast.success('Təcrübə silindi'),
    })
  }

  return {
    experiences,
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
