import { IConnexionType } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { ReactNode, useState } from 'react'
import { connexionContext } from './constants'

interface Props {
  children: ReactNode
}

export default function ConnexionContextProvider({ children }: Props) {
  const [connexionType, setConnexionType] = useState<IConnexionType>('http')

  return (
    <connexionContext.Provider value={{ connexionType, setConnexionType }}>
      {children}
    </connexionContext.Provider>
  )
}
