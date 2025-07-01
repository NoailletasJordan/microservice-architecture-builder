import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { UseQueryResult } from '@tanstack/react-query'
import { createContext } from 'react'
import { BackendQueryResponse } from '../User/constants'

interface IUserBoardsContext {
  boardsQuery: UseQueryResult<BackendQueryResponse<TBoardModel[]>, Error>
  boards: TBoardModel[]
  currentUserBoardId?: string
  setCurrentUserBoardId: (boardId: string) => void
  remove: (
    boardId: string,
  ) => Promise<BackendQueryResponse<Record<string, never>>>
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
  boardsQuery: null as any,
  boards: [],
  currentUserBoardId: undefined,
  setCurrentUserBoardId: () => {},
  remove: () =>
    Promise.resolve({} as BackendQueryResponse<Record<string, never>>),
  update: () => Promise.resolve({} as BackendQueryResponse<TBoardModel>),
  create: () => Promise.resolve({} as BackendQueryResponse<TBoardModel>),
})
