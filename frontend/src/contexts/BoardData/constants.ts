import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { UseQueryResult } from '@tanstack/react-query'
import { createContext } from 'react'

export interface BoardDataContext {
  nodes: TCustomNode[]
  edges: TCustomEdge[]
  title?: string
  boardDataQuery?: UseQueryResult<
    {
      nodes: any
      edges: any
    },
    Error
  >
}

export const boardDataContext = createContext<BoardDataContext>({
  nodes: [],
  edges: [],
  title: undefined,
  boardDataQuery: undefined,
})
