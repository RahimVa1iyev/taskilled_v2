import { useMutation } from '@tanstack/react-query'
import { linksApi } from '@/shared/api/links'
import type { LinkCreateRequest } from '@/shared/api/links'
import { LINKS_QUERY_KEYS } from '@/shared/constants/query-keys'
import { queryClient } from '@/shared/lib/query-client'
import { toast } from '@/shared/lib/toast'

export function useCreateLink() {
  return useMutation({
    mutationFn: (dto: LinkCreateRequest) => linksApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEYS.userLinks })
      toast.success('Link əlavə edildi')
    },
    onError: (error) => toast.apiError(error),
  })
}
