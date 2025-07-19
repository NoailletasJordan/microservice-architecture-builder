import { useEffectEventP } from '@/contants'
import { connexionPreviewContext } from '@/contexts/ConnexionPreview/context'
import { useHover } from '@mantine/hooks'
import { useContext, useEffect } from 'react'

interface Props {
  duet: [string, string]
}

export function useHandleConnexionPreview_({ duet }: Props) {
  const { hovered, ref } = useHover()
  const { addDuet, removeDuet } = useContext(connexionPreviewContext)

  const nonReactiveState = useEffectEventP(() => ({
    addDuet,
    removeDuet,
    duet,
  }))

  useEffect(() => {
    const { duet, addDuet, removeDuet } = nonReactiveState()
    if (hovered) {
      addDuet(duet)
    } else {
      removeDuet(duet)
    }
  }, [hovered, nonReactiveState])

  return { ref }
}
