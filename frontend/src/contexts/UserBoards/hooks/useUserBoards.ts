import { AUTH_TOKEN_KEY, BackendQueryResponse } from '@/contexts/User/constants'
import { useLocalStorage } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { TBoardModel } from '../constants'
import { useQueryKey } from './useQueryKey'

export function useUserBoards() {
  const [authToken] = useLocalStorage<string>({
    key: AUTH_TOKEN_KEY,
  })
  const queryKey = useQueryKey()

  return useQuery<BackendQueryResponse<TBoardModel[]>>({
    enabled: false,
    queryKey,
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/board`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((res) => res.json()),
    staleTime: Infinity,
  })
}
