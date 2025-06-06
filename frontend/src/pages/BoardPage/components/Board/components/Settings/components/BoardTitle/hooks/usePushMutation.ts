import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { useQueryKey as useQueryKeyBoardData } from '../../../../../../../../../contexts/BoardData/hooks/useQueryKey'

export default function usePushMutation() {
  const { update: updateBoard, currentUserBoardId } =
    useContext(userBoardsContext)
  const queryClient = useQueryClient()
  const queryKeyBoardData = useQueryKeyBoardData()

  return async (newTitle: string) => {
    if (!currentUserBoardId) return

    try {
      await updateBoard({
        boardId: currentUserBoardId!,
        payload: {
          title: newTitle,
        },
      })
    } catch (error) {
      console.error(error)
    } finally {
      // Boards already invalidated, now invalidate boardData
      queryClient.invalidateQueries({
        queryKey: queryKeyBoardData,
      })
    }
  }
}
