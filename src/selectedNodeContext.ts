import { createContext } from 'react'
import { TCustomNode } from './pages/BoardPage/components/Board/constants'

export type ID = string | null
export interface ISelectedNodeContext {
  node: TCustomNode | null
  setNode: (node: TCustomNode | null) => void
  openSelectedNodeSection: () => void
}

const selectedNodeContext = createContext<ISelectedNodeContext>({
  node: null,
  setNode: () => null,
  openSelectedNodeSection: () => null,
})

export default selectedNodeContext
