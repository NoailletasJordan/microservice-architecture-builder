import { useDisclosure } from '@mantine/hooks'
import { useCallback } from 'react'

export function useOpenToolbarMenu(): [
  boolean,
  {
    open: () => void
    close: () => void
    toggle: () => void
    lock: () => void
    unlock: () => void
  },
] {
  const [isOpen, { open: rawOpen, close }] = useDisclosure(false)
  const [isLocked, { close: unlock, open: lock }] = useDisclosure(false)

  const open = useCallback(() => {
    if (isLocked) return
    rawOpen()
  }, [isLocked, rawOpen])

  const toggle = useCallback(() => {
    isOpen ? close() : open()
  }, [open, close, isOpen])

  return [isOpen, { open, close, toggle, lock, unlock }]
}
