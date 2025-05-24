import { useLocalStorage, usePrevious } from '@mantine/hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AUTH_TOKEN_KEY } from '../User/constants'
import { TBoardModel } from './constants'

export function useUserBoards() {
  const [authToken] = useLocalStorage<string>({
    key: AUTH_TOKEN_KEY,
  })
  const queryKey = useQueryKey()

  return useQuery<TBoardModel[]>({
    enabled: !!authToken,
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

function useQueryKey() {
  const [authToken] = useLocalStorage<string>({
    key: AUTH_TOKEN_KEY,
  })

  return ['boards', authToken]
}

export function useHandleBoardsOnLogout(isLogged: boolean) {
  const previousIsLogged = usePrevious(isLogged)
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()

  if (!isLogged && previousIsLogged) {
    queryClient.removeQueries({ queryKey })
    queryClient.setQueryData(queryKey, undefined)
  }
}
