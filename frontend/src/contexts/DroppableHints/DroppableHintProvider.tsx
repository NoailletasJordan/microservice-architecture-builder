import { readLocalStorageValue, useLocalStorage } from '@mantine/hooks'
import { ReactNode } from 'react'
import { droppableHintsContext } from './constants'

interface Props {
  children: ReactNode
}

type HintStorage = { value: boolean }

export default function ContextProvider({ children }: Props) {
  const storageKey = 'allow-drop-areas-hints'
  const fromStorage = readLocalStorageValue<HintStorage | undefined>({
    key: storageKey,
  })
  const [{ value: bool }, setValue] = useLocalStorage<HintStorage>({
    key: storageKey,
    defaultValue: fromStorage || { value: true },
  })

  return (
    <droppableHintsContext.Provider
      value={{
        droppableHintsChecked: bool,
        setDroppableHintsChecked: (bool: boolean) => setValue({ value: bool }),
      }}
    >
      {children}
    </droppableHintsContext.Provider>
  )
}
