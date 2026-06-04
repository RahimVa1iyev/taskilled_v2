import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  useEducationQuery,
  useCreateEducationMutation,
  useDeleteEducationMutation,
} from '@/modules/profile/api/education.api'
import { educationSchema, type EducationFormData } from '@/modules/profile/schemas/education.schema'
import { toast } from '@/shared/lib/toast'

export function useEducation() {
  const { data: educations = [], isLoading } = useEducationQuery()
  const { mutate: create, isPending: isCreating } = useCreateEducationMutation()
  const { mutate: remove, isPending: isDeleting } = useDeleteEducationMutation()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      schoolName: '',
      degree: null,
      fieldOfStudy: null,
      startDate: null,
      endDate: null,
    },
  })

  function handleCreate(data: EducationFormData) {
    create(data, {
      onSuccess: () => {
        toast.success('Təhsil əlavə edildi')
        setIsFormOpen(false)
        form.reset()
      },
    })
  }

  function handleDelete(id: number) {
    remove(id, {
      onSuccess: () => toast.success('Təhsil silindi'),
    })
  }

  return {
    educations,
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
