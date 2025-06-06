import { BackendQueryResponse } from '@/contexts/User/constants'
import { useQuery } from '@tanstack/react-query'
import { TBoardModel } from '../constants'
import { useQueryKey } from './useQueryKey'

export function useUserBoards() {
  const queryKey = useQueryKey()
  const boardsQuery = useQuery<BackendQueryResponse<TBoardModel[]>>({
    queryKey,
    placeholderData: [],
    queryFn: async ({ queryKey }) => {
      const [_, authToken] = queryKey
      if (!authToken) {
        return []
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/board`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })

        if (!res.ok) throw new Error('Failed to fetch user boards')
        const result = await res.json()
        return result as TBoardModel[]
      }
    },
    staleTime: Infinity,
  })

  return {
    boardsQuery,
    boards: boardsQuery.data || [],
  }
}
