import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { useContext } from 'react'

export function useQueryKey() {
  const { currentUserBoardId } = useContext(userBoardsContext)

  return ['board', currentUserBoardId]
}
