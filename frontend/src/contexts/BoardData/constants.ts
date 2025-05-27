import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { createContext } from 'react'
import { OnEdgesChange, OnNodesChange } from 'reactflow'

export interface BoardDataContext {
  nodes: TCustomNode[]
  edges: TCustomEdge[]
  setNodes: React.Dispatch<React.SetStateAction<TCustomNode[]>>
  setEdges: React.Dispatch<React.SetStateAction<TCustomEdge[]>>
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
}

export const boardDataContext = createContext<BoardDataContext>({
  nodes: [],
  edges: [],
  setNodes: () => {},
  setEdges: () => {},
  onNodesChange: () => {},
  onEdgesChange: () => {},
})
