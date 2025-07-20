import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useEffect, useState } from 'react'

interface Props {
  node1?: TCustomNode
  node2?: TCustomNode
}

export function usePosition_({ node1, node2 }: Props) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (node1 && node2) {
      const center = {
        x:
          (node1.position?.x +
            (node1.measured?.width || 0) / 2 +
            node2.position?.x +
            (node2.measured?.width || 0) / 2) /
          2,
        y:
          (node1.position?.y +
            (node1.measured?.height || 0) / 2 +
            node2.position?.y +
            (node2.measured?.height || 0) / 2) /
          2,
      }
      setPosition(center)
    }
  }, [node1, node2])

  return position
}
