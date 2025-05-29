import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { createContext } from 'react'
import { BackendQueryResponse } from '../User/constants'
import { useUserBoards } from './hooks/useUserBoards'

interface IUserBoardsContext {
  boardsQuery?: ReturnType<typeof useUserBoards>
  currentUserBoardId?: string
  setCurrentUserBoardId: (boardId: string) => void
  remove: (boardId: string) => void
  update: ({
    boardId,
    payload,
  }: {
    boardId: string
    payload: Partial<TBoardModel>
  }) => Promise<BackendQueryResponse<TBoardModel>>
  create: ({
    title,
    nodes,
    edges,
  }: {
    title: string
    nodes: TCustomNode[]
    edges: TCustomEdge[]
  }) => Promise<BackendQueryResponse<TBoardModel>>
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
  setCurrentUserBoardId: () => {},
  remove: () => {},
  update: () => Promise.resolve({} as BackendQueryResponse<TBoardModel>),
  create: () => Promise.resolve({} as BackendQueryResponse<TBoardModel>),
})
