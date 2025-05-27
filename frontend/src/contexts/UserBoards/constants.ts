import { createContext } from 'react'
import { useUserBoards } from '../UserBoards/hooks'

interface IUserBoardsContext {
  boardsQuery?: ReturnType<typeof useUserBoards>
  currentUserBoardId?: string
  handleSetCurrentUserBoardId: (boardId: string) => void
}

export interface TBoardModel {
  id: string
  title: string
  owner: string
  data: any
  created_at?: string
  share_fragment?: string
}

export const userBoardsContext = createContext<IUserBoardsContext>({
  boardsQuery: undefined,
  currentUserBoardId: undefined,
  handleSetCurrentUserBoardId: () => {},
})
