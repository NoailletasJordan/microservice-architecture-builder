import { useDisclosure } from '@mantine/hooks'
import { useCallback, useState } from 'react'

export function useOpenToolbarMenu(): [
  { isOpen: boolean; coordinate: [number, number] },
  {
    open: (value: [number, number]) => void
    close: () => void
    toggle: (value: [number, number]) => void
    lock: () => void
    unlock: () => void
  },
] {
  const [isOpen, { open: rawOpen, close }] = useDisclosure(false)
  const [coordinate, setCoordinate] = useState<[number, number]>([0, 0])
  const [isLocked, { close: unlock, open: lock }] = useDisclosure(false)

  const open = useCallback(
    (newCoordinate: [number, number]) => {
      if (isLocked) return
      setCoordinate(newCoordinate)
      rawOpen()
    },
    [isLocked, rawOpen],
  )

  const toggle = useCallback(
    (newCoordinate: [number, number]) => {
      isOpen ? close() : open(newCoordinate)
    },
    [open, close, isOpen],
  )

  return [
    { isOpen, coordinate },
    {
      open,
      close,
      toggle,
      lock,
      unlock,
    },
  ]
}
