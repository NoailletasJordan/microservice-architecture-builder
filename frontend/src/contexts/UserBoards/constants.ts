import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { createContext } from 'react'
import { useUserBoards } from '../UserBoards/hooks'

interface IUserBoardsContext {
  boardsQuery?: ReturnType<typeof useUserBoards>
  currentUserBoardId?: string
  handleSetCurrentUserBoardId: (boardId: string) => void
  remove: (boardId: string) => void
  update: ({
    boardId,
    payload,
  }: {
    boardId: string
    payload: Partial<TBoardModel>
  }) => void
  create: ({
    title,
    nodes,
    edges,
  }: {
    title: string
    nodes: TCustomNode[]
    edges: TCustomEdge[]
  }) => void
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
  remove: () => {},
  update: () => {},
  create: () => {},
})
