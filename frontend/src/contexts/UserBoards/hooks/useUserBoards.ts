import { BackendQueryResponse } from '@/contexts/User/constants'
import { useQuery } from '@tanstack/react-query'
import { TBoardModel } from '../constants'
import { useQueryKey } from './useQueryKey'

export function useUserBoards() {
  const queryKey = useQueryKey()
  return useQuery<BackendQueryResponse<TBoardModel[]> | null>({
    queryKey,
    queryFn: async ({ queryKey }) => {
      const [_, authToken] = queryKey
      if (!authToken) {
        return null
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/board`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })

        if (!res.ok) throw new Error('Failed to fetch user boards')
        const result = await res.json()
        return result
      }
    },
    staleTime: Infinity,
    placeholderData: null,
  })
}
