import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { useContext } from 'react'

export function useCreateNewBoard() {
  const { create } = useContext(userBoardsContext)

  return () =>
    create({
      title: `New board ${new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date())}`,
      nodes: [],
      edges: [],
    })
}
