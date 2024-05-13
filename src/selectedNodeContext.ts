import { createContext } from 'react'
import { Datatype } from './pages/BoardPage/components/Board/constants'

export type ID = string | null
export interface ISelectedNodeContext {
  serviceId: Datatype['id'] | null
  setServiceId: (node: Datatype['id'] | null) => void
  openSelectedNodeSection: () => void
}

const selectedNodeContext = createContext<ISelectedNodeContext>({
  serviceId: null,
  setServiceId: () => null,
  openSelectedNodeSection: () => null,
})

export default selectedNodeContext
