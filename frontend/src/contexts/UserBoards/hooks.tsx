import { useLocalStorage, usePrevious } from '@mantine/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useRef } from 'react'
import {
  AUTH_TOKEN_KEY,
  BackendQueryResponse,
  userContext,
} from '../User/constants'
import { TBoardModel } from './constants'

export function useUserBoards() {
  const { isLogged } = useContext(userContext)
  const [authToken] = useLocalStorage<string>({
    key: AUTH_TOKEN_KEY,
  })
  const queryKey = useQueryKey()

  return useQuery<BackendQueryResponse<TBoardModel[]>>({
    enabled: !!authToken && isLogged,
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

export function useCreateBoardIfUserHaveNone(
  boardsQuery: ReturnType<typeof useUserBoards>,
  boardsMutationQuery: ReturnType<typeof useCreateBoard>,
) {
  const mutationRef = useRef(boardsMutationQuery.mutate)
  mutationRef.current = boardsMutationQuery.mutate

  useEffect(() => {
    if (!boardsQuery.isSuccess) return
    if (boardsQuery.isFetching) return
    if (!boardsQuery.data || 'error' in boardsQuery.data) return
    const hasOneBoardOrMore = boardsQuery.data.length > 0
    if (hasOneBoardOrMore) return
    if (boardsMutationQuery.isPending) return

    mutationRef.current()
  }, [
    boardsQuery.isSuccess,
    boardsQuery.data,
    boardsQuery.isFetching,
    boardsMutationQuery.isPending,
  ])
}

export const useCreateBoard = () => {
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()
  const [authToken] = useLocalStorage<string>({
    key: AUTH_TOKEN_KEY,
  })

  const newBoardData = {
    title: 'New board',
    data: '{}',
  }

  return useMutation({
    mutationFn: async () => {
      if (!authToken) throw new Error('No auth token')

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/board`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newBoardData),
      })
      if (!res.ok) throw new Error('Failed to create board')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
