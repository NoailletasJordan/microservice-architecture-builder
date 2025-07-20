import { ReactNode, useCallback, useState } from 'react'
import { connexionPreviewContext } from './context'

interface Props {
  children: ReactNode
}

export default function Provider({ children }: Props) {
  const [duets, setDuets] = useState<[string, string][]>([])

  const addDuet = useCallback((duet: [string, string]) => {
    setDuets((prev) => [duet, ...prev])
  }, [])

  const removeDuet = useCallback((duet: [string, string]) => {
    setDuets((prev) => prev.filter((d) => d[0] !== duet[0] && d[1] !== duet[1]))
  }, [])

  return (
    <connexionPreviewContext.Provider
      value={{ duets, addDuet, removeDuet, activeDuet: duets[0] }}
    >
      {children}
    </connexionPreviewContext.Provider>
  )
}
