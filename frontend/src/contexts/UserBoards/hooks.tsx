import { getDataToStoreObject, useEffectEventP } from '@/contants'
import { useLocalStorage, usePrevious } from '@mantine/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect } from 'react'
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

export function useHandleBoardsOnLogout({
  isLogged,
  resetCurrentUserBoard,
}: {
  isLogged: boolean
  resetCurrentUserBoard: () => void
}) {
  const previousIsLogged = usePrevious(isLogged)
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()

  if (!isLogged && previousIsLogged) {
    queryClient.removeQueries({ queryKey })
    queryClient.setQueryData(queryKey, undefined)
    resetCurrentUserBoard()
  }
}

export function useCreateBoardIfUserHaveNone(
  boardsQuery: ReturnType<typeof useUserBoards>,
) {
  const flowInstance = useReactFlow()
  const boardsMutator = useMutateBoards()
  const mutateBoardsMemo = useEffectEventP(
    (body: Parameters<typeof boardsMutator.mutate>[0]) =>
      boardsMutator.mutate(body),
  )

  const getNewBoardDataMemo = useEffectEventP(() =>
    getDataToStoreObject(flowInstance.getNodes(), flowInstance.getEdges()),
  )

  useEffect(() => {
    if (!boardsQuery.isSuccess) return
    if (boardsQuery.isFetching) return
    if (!boardsQuery.data || 'error' in boardsQuery.data) return
    const hasOneBoardOrMore = boardsQuery.data.length > 0
    if (hasOneBoardOrMore) return
    if (boardsMutator.isPending) return

    const newBoardDataDefault = {
      title: 'New board',
      data: getNewBoardDataMemo(),
    }
    mutateBoardsMemo({ payload: newBoardDataDefault, method: 'POST' })
  }, [
    boardsQuery.isSuccess,
    boardsQuery.data,
    boardsQuery.isFetching,
    boardsMutator.isPending,
    getNewBoardDataMemo,
    mutateBoardsMemo,
  ])
}

export function useSetCurrentUserBoardOnLogging(
  __setCurrentUserBoard: React.Dispatch<
    React.SetStateAction<string | undefined>
  >,
) {
  const boardsQuery = useUserBoards()
  const setCurrentUserBoardMemo = useEffectEventP(__setCurrentUserBoard)
  useEffect(() => {
    const hasBoards =
      boardsQuery.isSuccess &&
      Array.isArray(boardsQuery.data) &&
      boardsQuery.data.length > 0
    if (hasBoards) {
      setCurrentUserBoardMemo((boardsQuery.data as TBoardModel[])[0].id)
    }
  }, [boardsQuery.isSuccess, boardsQuery.data, setCurrentUserBoardMemo])
}

// Base mutation
export function useMutateBoards() {
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()
  const [authToken] = useLocalStorage<string>({
    key: AUTH_TOKEN_KEY,
  })

  return useMutation({
    mutationFn: async ({
      payload,
      method,
      boardId,
    }: {
      payload?: Partial<TBoardModel>
      method: 'POST' | 'PATCH' | 'DELETE'
      boardId?: string
    }) => {
      if (!authToken) throw new Error('No auth token')

      const config = {
        POST: {
          url: `${import.meta.env.VITE_API_URL}/api/board`,
          errorMessage: 'Failed to create board',
        },
        PATCH: {
          url: `${import.meta.env.VITE_API_URL}/api/board/${boardId}`,
          errorMessage: 'Failed to update board',
        },
        DELETE: {
          url: `${import.meta.env.VITE_API_URL}/api/board/${boardId}`,
          errorMessage: 'Failed to delete board',
        },
      }

      if (payload?.data) payload.data = JSON.stringify(payload.data)

      const res = await fetch(config[method].url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(config[method].errorMessage)
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
    onError: (error: unknown) => {
      showNotificationError('Error creating board', error)
    },
  })
}
