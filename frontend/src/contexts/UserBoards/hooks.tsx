import { getDataToStoreObject } from '@/contants'
import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useLocalStorage, usePrevious } from '@mantine/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ReactFlowInstance } from 'reactflow'
import { AUTH_TOKEN_KEY, BackendQueryResponse } from '../User/constants'
import { TBoardModel } from './constants'

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

export function useQueryKey() {
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

export function useMutateUserBoard({
  currentUserBoardId,
  setCurrentUserBoardId,
}: {
  currentUserBoardId: string | undefined
  setCurrentUserBoardId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
}) {
  const mutateBoard = useMutateBoards()
  const boardsQuery = useUserBoards()

  return {
    create: ({
      title,
      nodes,
      edges,
    }: {
      title: string
      nodes: TCustomNode[]
      edges: TCustomEdge[]
    }) => {
      return mutateBoard.mutateAsync({
        method: 'POST',
        payload: {
          title,
          data: getDataToStoreObject(nodes, edges),
        },
      })
    },
    update: ({
      boardId,
      payload,
    }: {
      boardId: string
      payload: Partial<TBoardModel>
    }) => {
      return mutateBoard.mutateAsync({
        method: 'PATCH',
        boardId,
        payload,
      })
    },

    remove: (boardId: string) => {
      const promise = mutateBoard.mutateAsync({
        method: 'DELETE',
        boardId,
      })
      const mightUpdateCurrentId =
        Array.isArray(boardsQuery.data) && boardsQuery.data.length >= 2

      if (mightUpdateCurrentId) {
        const boards = boardsQuery.data as TBoardModel[]
        const currentBoardIndex = boards.findIndex(
          (board) => board.id === currentUserBoardId,
        )
        const deleteBoardIndex = boards.findIndex(
          (board) => board.id === boardId,
        )

        if (currentBoardIndex === deleteBoardIndex) {
          const nextIndex = (currentBoardIndex + 1) % boards.length
          setCurrentUserBoardId(boards[nextIndex].id)
        }
      }
      return promise
    },
  }
}

export async function handleLoadUserBoards({
  setCurrentUserBoardId,
  boardsQuery: oldBoardsQuery,
  flowInstance,
  createNewBoard,
}: {
  setCurrentUserBoardId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
  boardsQuery: ReturnType<typeof useUserBoards>
  flowInstance: ReactFlowInstance
  createNewBoard: ({
    title,
    nodes,
    edges,
  }: {
    title: string
    nodes: TCustomNode[]
    edges: TCustomEdge[]
  }) => Promise<any>
}) {
  const { data, isSuccess } = await oldBoardsQuery.refetch()
  if (!isSuccess || 'error' in data) return
  const hadCurrentDataBoard = flowInstance.getNodes().length > 0

  // if user Has board data, create new userboard and load it
  if (hadCurrentDataBoard) {
    const data = await createNewBoard({
      title: 'New board',
      nodes: flowInstance.getNodes(),
      edges: flowInstance.getEdges(),
    })
    setCurrentUserBoardId(data.id)
    return
  }

  const userBoards = data as TBoardModel[]
  if (userBoards.length === 0) {
    // If user has no boards, create a new one and load it
    const data = await createNewBoard({
      title: 'New board',
      nodes: flowInstance.getNodes(),
      edges: flowInstance.getEdges(),
    })
    setCurrentUserBoardId(data.id)
    return
  } else {
    // If user has boards, load the first one
    setCurrentUserBoardId(userBoards[0].id)
  }
}

// BareMutation
function useMutateBoards() {
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()
  const boardsQuery = useUserBoards()
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
          url: `${import.meta.env.vite_api_url}/api/board`,
          errormessage: 'failed to create board',
        },
        PATCH: {
          url: `${import.meta.env.vite_api_url}/api/board/${boardId}`,
          errormessage: 'failed to update board',
        },
        DELETE: {
          url: `${import.meta.env.vite_api_url}/api/board/${boardId}`,
          errormessage: 'failed to delete board',
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
      if (!res.ok) throw new Error(config[method].errormessage)
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      boardsQuery.refetch()
    },
  })
}
