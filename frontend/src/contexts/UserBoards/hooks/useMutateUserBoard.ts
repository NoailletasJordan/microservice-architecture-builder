import { getApiUrl, getDataToStoreObject } from '@/contants'
import { AUTH_TOKEN_KEY, BackendQueryResponse } from '@/contexts/User/constants'
import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useLocalStorage } from '@mantine/hooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TBoardModel } from '../constants'
import { useQueryKey } from './useQueryKey'

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
  const queryClient = useQueryClient()
  const queryKey = useQueryKey()

  return {
    create: async ({
      title,
      nodes,
      edges,
    }: {
      title: string
      nodes: TCustomNode[]
      edges: TCustomEdge[]
    }) => {
      const response: BackendQueryResponse<TBoardModel> =
        await mutateBoard.mutateAsync({
          method: 'POST',
          payload: {
            title,
            data: getDataToStoreObject(nodes, edges),
          },
        })

      if (!('error' in response)) {
        // Update cache optimisticly and update new boardId
        const oldBoards = queryClient.getQueryData(queryKey) as TBoardModel[]
        queryClient.setQueryData(queryKey, [response, ...oldBoards])
        setCurrentUserBoardId(response.id)
      }
      return response
    },
    update: async ({
      boardId,
      payload,
    }: {
      boardId: string
      payload: Partial<TBoardModel>
    }) => {
      const response: BackendQueryResponse<TBoardModel> =
        await mutateBoard.mutateAsync({
          method: 'PATCH',
          boardId,
          payload,
        })

      if (!('error' in response)) {
        // Update cache optimisticly
        const oldBoards = queryClient.getQueryData(queryKey) as TBoardModel[]
        const specificToUpdate = oldBoards.find(
          (boards) => boardId === boards.id,
        )
        if (!!specificToUpdate && !!payload) {
          queryClient.setQueryData(queryKey, [
            ...oldBoards.map((board) =>
              board.id === boardId ? { ...board, ...payload } : board,
            ),
          ])
        }
      }
      return response
    },

    remove: async (boardId: string) => {
      const response: BackendQueryResponse<Record<string, never>> =
        await mutateBoard.mutateAsync({
          method: 'DELETE',
          boardId,
        })

      if (!('error' in response)) {
        const oldBoards = queryClient.getQueryData(queryKey) as TBoardModel[]

        const atLeastTwoBoards = oldBoards.length >= 2
        if (atLeastTwoBoards) {
          // Update currentboardId if needed
          const boards = oldBoards
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

        // Update cache optimisticly
        queryClient.setQueryData(
          queryKey,
          oldBoards.filter((boards) => boardId !== boards.id),
        )
      }
      return response
    },
  }
}

export interface MutationUserBoard {
  payload?: Partial<TBoardModel>
  method: 'POST' | 'PATCH' | 'DELETE'
  boardId?: string
}

// BareMutation
function useMutateBoards() {
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()
  const [authToken] = useLocalStorage<string>({
    key: AUTH_TOKEN_KEY,
  })

  return useMutation({
    mutationKey: queryKey,
    mutationFn: async (params: MutationUserBoard) => {
      const { payload, method, boardId } = params
      if (!authToken) throw new Error('No auth token')

      const apiUrl = getApiUrl()
      const config = {
        POST: {
          url: `${apiUrl}/api/board`,
          errormessage: 'failed to create board',
        },
        PATCH: {
          url: `${apiUrl}/api/board/${boardId}`,
          errormessage: 'failed to update board',
        },
        DELETE: {
          url: `${apiUrl}/api/board/${boardId}`,
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
