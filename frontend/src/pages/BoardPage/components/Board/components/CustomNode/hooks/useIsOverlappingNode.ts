import { useEffectEventP } from '@/contants'
import { getNodeOverlapping } from '@/pages/BoardPage/configs/helpers'
import { useEffect, useState } from 'react'
import { useReactFlow } from 'reactflow'

interface Props {
  nodeId: string
  posX: number
  posY: number
}

export function useIsOverlappingNode({ nodeId, posX, posY }: Props) {
  const flowInstance = useReactFlow()

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
