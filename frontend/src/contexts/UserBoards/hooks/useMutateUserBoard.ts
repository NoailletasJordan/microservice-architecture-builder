import { getDataToStoreObject } from '@/contants'
import { AUTH_TOKEN_KEY } from '@/contexts/User/constants'
import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useLocalStorage } from '@mantine/hooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TBoardModel } from '../constants'
import { useQueryKey } from './useQueryKey'
import { useUserBoards } from './useUserBoards'

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
          /** Temp */
          console.log('setter 4')
          setCurrentUserBoardId(boards[nextIndex].id)
        }
      }
      return promise
    },
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
          url: `${import.meta.env.VITE_API_URL}/api/board`,
          errormessage: 'failed to create board',
        },
        PATCH: {
          url: `${import.meta.env.VITE_API_URL}/api/board/${boardId}`,
          errormessage: 'failed to update board',
        },
        DELETE: {
          url: `${import.meta.env.VITE_API_URL}/api/board/${boardId}`,
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
