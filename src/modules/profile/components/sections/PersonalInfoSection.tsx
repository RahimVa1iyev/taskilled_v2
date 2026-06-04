import { User } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { SectionCard } from '@/modules/profile/components/shared/SectionCard'
import { usePersonalInfo } from '@/modules/profile/hooks/usePersonalInfo'
import { lookupApi } from '@/shared/api/lookup/lookup.api'
import { FormInput, FormTextarea, FormSelect } from '@/shared/ui'
import { cn } from '@/shared/utils/cn'

function InfoItem({ label, value }: { label: string; value: string | undefined | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] font-semibold text-[--color-text-muted] uppercase tracking-wider">{label}</span>
      <span className="text-[14px] font-medium text-[--color-sidebar-text]">{value || '—'}</span>
    </div>
  )
}

export function PersonalInfoSection(): React.JSX.Element {
  const { form, isPending, handleSubmit, profile, handleEdit, handleCancel, isEditing } = usePersonalInfo()

  const { data: countries = [] } = useQuery({
    queryKey: ['lookup', 'countries'],
    queryFn: lookupApi.getCountries,
    staleTime: 30 * 60 * 1000,
  })

  const watchCountry = form.watch('countryId')

  const { data: cities = [] } = useQuery({
    queryKey: ['lookup', 'cities', watchCountry],
    queryFn: () => lookupApi.getCities(watchCountry!),
    enabled: !!watchCountry,
    staleTime: 10 * 60 * 1000,
  })

  const countryOptions = countries.map((c) => ({ value: c.id, label: c.name }))
  const cityOptions = cities.map((c) => ({ value: c.id, label: c.name }))

  const isDirty = Object.keys(form.formState.dirtyFields).length > 0

  const handleFormSubmit = async (e: React.BaseSyntheticEvent) => {
    await handleSubmit(e)
  }

  const countryName = profile?.country?.name || countries.find(c => c.id === profile?.country?.id)?.name
  const cityName = profile?.city?.name || cities.find(c => c.id === profile?.city?.id)?.name
  const location = [cityName, countryName].filter(Boolean).join(', ')

  return (
    <SectionCard
      id="personal-info"
      title="Personal Information"
      description="Basic details about you, your contact info, and a short bio."
      icon={<User size={16} />}
      isEditing={isEditing}
      onEdit={isEditing ? handleCancel : handleEdit}
      editLabel="Düzəliş et"
    >
      <div id="personal-info-form" className="mt-4">
        {isEditing ? (
          <form 
            onSubmit={handleFormSubmit} 
            className="space-y-[24px] mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              <FormInput control={form.control} name="firstName" label="First Name" placeholder="Your first name" />
              <FormInput control={form.control} name="lastName" label="Last Name" placeholder="Your last name" />
            </div>

            <FormInput control={form.control} name="areasOfInterest" label="Professional Title / Areas of Interest" placeholder="e.g. Frontend Developer" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              <FormInput control={form.control} name="birthDate" label="Birth Date" type="date" />
              <FormSelect
                control={form.control}
                name="gender"
                label="Gender"
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              <FormSelect
                control={form.control}
                name="countryId"
                label="Country"
                options={countryOptions}
                onChange={() => form.setValue('cityId', null)}
              />
              <FormSelect
                control={form.control}
                name="cityId"
                label="City"
                options={cityOptions}
                disabled={!watchCountry}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              <FormInput control={form.control} name="phoneNumber" label="Phone" placeholder="+994 xx xxx xx xx" />
              <FormInput control={form.control} name="webSite" label="Website" placeholder="https://..." />
            </div>

            <FormTextarea
              control={form.control}
              name="bio"
              label="Bio / About"
              placeholder="Write a short summary about yourself..."
              rows={4}
            />

            <div className="flex justify-end pt-2 transition-opacity duration-300">
              <button
                type="submit"
                disabled={isPending || !isDirty}
                className={cn(
                  'flex items-center gap-2 rounded-[14px] bg-brand px-6 py-3 text-[14px] font-bold text-brand-on shadow-md shadow-brand/20 transition-all hover:shadow-lg hover:shadow-brand/40 hover:-translate-y-0.5 cursor-pointer',
                  (isPending || !isDirty) && 'opacity-60 cursor-not-allowed hover:translate-y-0 hover:shadow-md'
                )}
              >
                {isPending ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 px-2">
            <InfoItem label="Full Name" value={`${profile?.firstName || ''} ${profile?.lastName || ''}`.trim()} />
            <InfoItem label="Professional Title" value={profile?.areasOfInterest} />
            <InfoItem label="Birth Date" value={profile?.birthDate ? new Date(profile.birthDate).toLocaleDateString() : null} />
            <InfoItem label="Gender" value={profile?.gender} />
            <InfoItem label="Location" value={location} />
            <InfoItem label="Phone Number" value={profile?.phoneNumber} />
            <InfoItem label="Website" value={profile?.webSite} />
            {profile?.bio && (
              <div className="md:col-span-2 mt-2">
                <span className="text-[12px] font-semibold text-[--color-text-muted] uppercase tracking-wider block mb-2">Bio / About</span>
                <p className="text-[14px] leading-relaxed text-[--color-sidebar-text] whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  )
}
