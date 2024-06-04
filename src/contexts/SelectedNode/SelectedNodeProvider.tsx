import { IService } from '@/pages/BoardPage/configs/constants'
import { useDisclosure } from '@mantine/hooks'
import { ReactNode, useState } from 'react'
import { ISelectedNodeContext, selectedNodeContext } from './constants'

interface Props {
  children: ReactNode
}

export default function SelectedNodeProvider({ children }: Props) {
  const [serviceId, setServiceId] = useState<IService['id'] | null>(null)

  const [asideIsOpened, { open: openAside, toggle: toggleAsideOpen }] =
    useDisclosure(false)

  const value: ISelectedNodeContext = {
    serviceId,
    setServiceId: (newId: IService['id'] | null) => {
      setServiceId(newId)
    },
    asideIsOpened,
    openAside,
    toggleAsideOpen,
  }

  return (
    <selectedNodeContext.Provider value={value}>
      {children}
    </selectedNodeContext.Provider>
  )
}
