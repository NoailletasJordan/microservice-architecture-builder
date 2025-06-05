import { boardDataContext } from '@/contexts/BoardData/constants'
import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { useContext } from 'react'

export function useDuplicateBoard() {
  const { create } = useContext(userBoardsContext)
  const { edges, nodes, title } = useContext(boardDataContext)

  return () => {
    create({
      title: `${title} (copy)`,
      nodes,
      edges,
    })
  }
}
