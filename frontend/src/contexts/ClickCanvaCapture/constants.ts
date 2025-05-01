import { createContext } from 'react'

export interface IClickCanva {
  canvaClickIncrement: number
  triggerClickCanva: () => void
}

export const clickCanvaContext = createContext<IClickCanva>({
  canvaClickIncrement: 0,
  triggerClickCanva: () => null,
})
