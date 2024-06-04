import { IService } from '@/pages/BoardPage/configs/constants'
import { createContext } from 'react'

export type ID = string | null
export interface ISelectedNodeContext {
  serviceId: IService['id'] | null
  setServiceId: (node: IService['id'] | null) => void
  asideIsOpened: boolean
  openAside: () => void
  toggleAsideOpen: () => void
}

export const selectedNodeContext = createContext<ISelectedNodeContext>({
  serviceId: null,
  setServiceId: () => null,
  asideIsOpened: false,
  openAside: () => null,
  toggleAsideOpen: () => null,
})
