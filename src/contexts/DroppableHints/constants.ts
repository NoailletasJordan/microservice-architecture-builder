import { createContext } from 'react'

export interface IDroppableHintContext {
  droppableHintsChecked: boolean
  setDroppableHintsChecked: (droppableHintsChecked: boolean) => void
}

export const droppableHintsContext = createContext<IDroppableHintContext>({
  droppableHintsChecked: true,
  setDroppableHintsChecked: () => null,
})
