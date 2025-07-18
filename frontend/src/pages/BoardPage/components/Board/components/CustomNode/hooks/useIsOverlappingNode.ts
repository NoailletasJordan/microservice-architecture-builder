import { useEffectEventP } from '@/contants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { getNodeOverlapping } from '@/pages/BoardPage/configs/helpers'
import { useReactFlow } from '@xyflow/react'
import { useEffect, useState } from 'react'
import { TCustomEdge } from '../../connexionContants'

interface Props {
  nodeId: string
  posX: number
  posY: number
}

export function useIsOverlappingNode({ nodeId, posX, posY }: Props) {
  const flowInstance = useReactFlow<TCustomNode, TCustomEdge>()

  const [isOverlappingNode, setIsOverlappingNode] = useState(false)
  const handleOverlapping = () => {
    setIsOverlappingNode(
      !!getNodeOverlapping(
        flowInstance.getNode(nodeId)!,
        flowInstance.getNodes(),
      ),
    )
  }

  const nonReactiveState = useEffectEventP(() => ({
    flowInstance,
    handleOverlapping,
  }))

  useEffect(() => {
    const { handleOverlapping } = nonReactiveState()
    handleOverlapping()
  }, [posX, posY, nonReactiveState])

  return isOverlappingNode
}
