import { getNodeOverlapping } from '@/pages/BoardPage/configs/helpers'
import { useMemo } from 'react'
import { useReactFlow } from 'reactflow'

export function useIsOverlappingNode({ nodeId }: { nodeId: string }) {
  const flowInstance = useReactFlow()

  const isOverlapingNode = useMemo(
    () =>
      !!getNodeOverlapping(
        flowInstance.getNode(nodeId)!,
        flowInstance.getNodes(),
      ),
    [flowInstance, nodeId],
  )

  return isOverlapingNode
}
