import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useUpdateMeMutation } from '@/modules/profile/api/profile.api'
import { useProfileQuery } from '@/modules/profile/api/profile.api'
import { personalInfoSchema, type PersonalInfoFormData } from '@/modules/profile/schemas/personalInfo.schema'
import { toast } from '@/shared/lib/toast'

export function usePersonalInfo() {
  const { data: profile } = useProfileQuery()
  const { mutate: updateMe, isPending } = useUpdateMeMutation()
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName:   profile?.firstName   ?? '',
      lastName:    profile?.lastName    ?? '',
      bio:         profile?.bio         ?? '',
      areasOfInterest: profile?.areasOfInterest ?? '',
      birthDate:   profile?.birthDate   ? profile.birthDate.split('T')[0] : '',
      gender:      profile?.gender      ?? null,
      phoneNumber: profile?.phoneNumber ?? '',
      webSite:     profile?.webSite     ?? '',
      countryId:   profile?.country?.id ?? null,
      cityId:      profile?.city?.id    ?? null,
    },
  })

  function handleEdit() {
    form.reset({
      firstName:   profile?.firstName   ?? '',
      lastName:    profile?.lastName    ?? '',
      bio:         profile?.bio         ?? '',
      areasOfInterest: profile?.areasOfInterest ?? '',
      birthDate:   profile?.birthDate   ? profile.birthDate.split('T')[0] : '',
      gender:      profile?.gender      ?? null,
      phoneNumber: profile?.phoneNumber ?? '',
      webSite:     profile?.webSite     ?? '',
      countryId:   profile?.country?.id ?? null,
      cityId:      profile?.city?.id    ?? null,
    })
    setIsEditing(true)
  }

  function handleCancel() {
    setIsEditing(false)
    form.reset()
  }

  function handleSubmit(data: PersonalInfoFormData) {
    updateMe(data, {
      onSuccess: () => {
        toast.success('Profil yeniləndi')
        setIsEditing(false)
      },
    })
  }

  return {
    profile,
    form,
    isEditing,
    isPending,
    handleEdit,
    handleCancel,
    handleSubmit: form.handleSubmit(handleSubmit),
  }
}
