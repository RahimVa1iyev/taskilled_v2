import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  useLanguagesQuery,
  useBulkAddLanguagesMutation,
  useDeleteLanguageMutation,
} from '@/modules/profile/api/languages.api'
import { languageSchema, type LanguageFormData } from '@/modules/profile/schemas/language.schema'
import { toast } from '@/shared/lib/toast'

export function useLanguages() {
  const { data: languages = [], isLoading } = useLanguagesQuery()
  const { mutate: bulkAdd, isPending: isSaving } = useBulkAddLanguagesMutation()
  const { mutate: deleteLang, isPending: isDeleting } = useDeleteLanguageMutation()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const form = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
    defaultValues: { language: '', level: '' },
  })

  function handleAdd(data: LanguageFormData) {
    bulkAdd([{ language: data.language, level: data.level }], {
      onSuccess: () => {
        toast.success('Dil əlavə edildi')
        setIsFormOpen(false)
        form.reset()
      },
    })
  }

  function handleDelete(language: number) {
    deleteLang(language, {
      onSuccess: () => toast.success('Dil silindi'),
    })
  }

  return {
    languages,
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
