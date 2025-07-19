import { createContext } from 'react'

export interface IConnexionPreviewContext {
  duets: [string, string][]
  addDuet: (duet: [string, string]) => void
  removeDuet: (duet: [string, string]) => void
  activeDuet: [string, string] | null
}

export const connexionPreviewContext = createContext<IConnexionPreviewContext>({
  duets: [],
  addDuet: () => {},
  removeDuet: () => {},
  activeDuet: null,
})
