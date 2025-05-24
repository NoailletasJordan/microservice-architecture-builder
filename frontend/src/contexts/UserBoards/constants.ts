import { createContext } from 'react'
import { useUserBoards } from '../UserBoards/hooks'

interface IUserBoardsContext {
  boardsQuery?: ReturnType<typeof useUserBoards>
  currentUserBoard?: string
  handleSetCurrentUserBoard: (boardId: string) => void
}

export interface TBoardModel {
  id: string
  title: string
  owner: string
  data: string
  created_at?: string
  share_fragment?: string
}

export const userBoardsContext = createContext<IUserBoardsContext>({
  boardsQuery: undefined,
  currentUserBoard: undefined,
  handleSetCurrentUserBoard: () => {},
})
