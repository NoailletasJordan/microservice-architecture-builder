import { IConnexionType } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { createContext } from 'react'

export interface IConnexionContext {
  connexionType: IConnexionType
  setConnexionType: (connexionType: IConnexionType) => void
}

export const connexionContext = createContext<IConnexionContext>({
  connexionType: 'http',
  setConnexionType: () => null,
})
