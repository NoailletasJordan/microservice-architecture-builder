import { getDataToStoreObject, useEffectEventP } from '@/contants'
import { useLocalStorage, usePrevious } from '@mantine/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useRef } from 'react'
import { useReactFlow } from 'reactflow'
import {
  AUTH_TOKEN_KEY,
  BackendQueryResponse,
  userContext,
} from '../User/constants'
import { showNotificationError } from '../User/UserProvider'
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
) {
  const boardsMutator = useMutateBoards()
  const mutateBoardRef = useRef(boardsMutator.mutate)
  mutateBoardRef.current = boardsMutator.mutate
  const flowInstance = useReactFlow()

  const getNewBoardData = useEffectEventP(() => {
    return getDataToStoreObject(
      flowInstance.getNodes(),
      flowInstance.getEdges(),
    )
  })

  useEffect(() => {
    if (!boardsQuery.isSuccess) return
    if (boardsQuery.isFetching) return
    if (!boardsQuery.data || 'error' in boardsQuery.data) return
    const hasOneBoardOrMore = boardsQuery.data.length > 0
    if (hasOneBoardOrMore) return
    if (boardsMutator.isPending) return

    const newBoardDataDefault = {
      title: 'New board',
      // data: flowInstanceRef.current.getNodes(),
      data: getNewBoardData(),
    }
    mutateBoardRef.current(newBoardDataDefault)
  }, [
    boardsQuery.isSuccess,
    boardsQuery.data,
    boardsQuery.isFetching,
    boardsMutator.isPending,
  ])
}

export function useShowNotificationOnMutationError() {
  const boardsMutator = useMutateBoards()

  useEffect(() => {
    if (boardsMutator.isError || boardsMutator.error) {
      showNotificationError('Error creating board', boardsMutator.error)
    }
  }, [boardsMutator.failureReason, boardsMutator.isError, boardsMutator.error])
}

// Base mutation
function useMutateBoards() {
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()
  const [authToken] = useLocalStorage<string>({
    key: AUTH_TOKEN_KEY,
  })

  return useMutation({
    mutationFn: async (payload: any) => {
      if (!authToken) throw new Error('No auth token')

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/board`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to create board')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
