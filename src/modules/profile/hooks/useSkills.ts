import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  useSkillsQuery,
  useSetSkillsMutation,
  useDeleteSkillMutation,
} from '@/modules/profile/api/skills.api'
import { skillSchema, type SkillFormData } from '@/modules/profile/schemas/skill.schema'
import { toast } from '@/shared/lib/toast'

export function useSkills() {
  const { data: skills = [], isLoading } = useSkillsQuery()
  const { mutate: setSkills, isPending: isSaving } = useSetSkillsMutation()
  const { mutate: deleteSkill, isPending: isDeleting } = useDeleteSkillMutation()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: { skillId: undefined, level: null },
  })

  function handleAdd(data: SkillFormData) {
    setSkills([{ skillId: data.skillId, level: data.level ?? null }], {
      onSuccess: () => {
        toast.success('Bacarıq əlavə edildi')
        setIsFormOpen(false)
        form.reset()
      },
    })
  }

  function handleDelete(skillId: number) {
    deleteSkill(skillId, {
      onSuccess: () => toast.success('Bacarıq silindi'),
    })
  }

  return {
    skills,
    isLoading,
    isSaving,
    isDeleting,
    isFormOpen,
    setIsFormOpen,
    form,
    handleAdd: form.handleSubmit(handleAdd),
    handleDelete,
  }
}
