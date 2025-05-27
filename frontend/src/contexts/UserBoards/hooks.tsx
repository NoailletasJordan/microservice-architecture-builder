import {
  getDataToStoreObject,
  showNotificationError,
  useEffectEventP,
} from '@/contants'
import { useLocalStorage, usePrevious } from '@mantine/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useRef } from 'react'
import { useReactFlow } from 'reactflow'
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

export function useHandleBoardsOnLogout({
  isLogged,
  resetCurrentUserBoardId,
}: {
  isLogged: boolean
  resetCurrentUserBoardId: () => void
}) {
  const previousIsLogged = usePrevious(isLogged)
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()

  if (!isLogged && previousIsLogged) {
    queryClient.removeQueries({ queryKey })
    queryClient.setQueryData(queryKey, undefined)
    resetCurrentUserBoardId()
  }
}

export function useOnBoardsDataFirstLoad({
  boardsQuery,
  setCurrentUserBoardId,
}: {
  boardsQuery: ReturnType<typeof useUserBoards>
  setCurrentUserBoardId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
}) {
  const flowInstance = useReactFlow()
  const mutator = useMutateBoards()
  const ranOnceRef = useRef(false)
  const nonReactiveState = useEffectEventP(() => ({
    flowInstance,
    boardsQuery,
    mutator,
    setCurrentUserBoardId,
    ranOnceRef,
  }))

  useEffect(() => {
    ;(() => {
      if (ranOnceRef.current) return
      ranOnceRef.current = true
      /** Temp */
      console.log('called:')
      const { setCurrentUserBoardId, boardsQuery, flowInstance, mutator } =
        nonReactiveState()
      if (!boardsQuery.isSuccess || 'error' in boardsQuery.data) return
      const hadCurrentDataBoard = flowInstance.getNodes().length > 0

      // if user Has board data, create new userboard and load it
      if (hadCurrentDataBoard) {
        mutator.mutate(
          {
            payload: {
              data: getDataToStoreObject(
                flowInstance.getNodes(),
                flowInstance.getEdges(),
              ),
            },
            method: 'POST',
          },
          {
            onSuccess: (data: TBoardModel) => {
              setCurrentUserBoardId(data.id)
            },
          },
        )
        return
      }

      const userBoards = boardsQuery.data as TBoardModel[]
      if (userBoards.length === 0) {
        // If user has no boards, create a new one and load it
        const newBoardDataDefault = {
          title: 'New board',
          data: getDataToStoreObject(
            flowInstance.getNodes(),
            flowInstance.getEdges(),
          ),
        }
        mutator.mutate(
          { payload: newBoardDataDefault, method: 'POST' },
          {
            onSuccess: (data: TBoardModel) => {
              setCurrentUserBoardId(data.id)
            },
          },
        )
      } else {
        // If user has boards, load the first one
        if (userBoards.length > 0) {
          setCurrentUserBoardId(userBoards[0].id)
        }
      }
    })()
  }, [boardsQuery.data, nonReactiveState])
}

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
