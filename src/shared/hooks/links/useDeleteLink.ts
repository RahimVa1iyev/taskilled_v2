import { useMutation } from '@tanstack/react-query'
import { linksApi } from '@/shared/api/links'
import { LINKS_QUERY_KEYS } from '@/shared/constants/query-keys'
import { queryClient } from '@/shared/lib/query-client'
import { toast } from '@/shared/lib/toast'

export function useDeleteLink() {
  return useMutation({
    mutationFn: (linkId: number) => linksApi.delete(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEYS.userLinks })
      toast.success('Link silindi')
    },
    onError: (error) => toast.apiError(error),
  })
}
