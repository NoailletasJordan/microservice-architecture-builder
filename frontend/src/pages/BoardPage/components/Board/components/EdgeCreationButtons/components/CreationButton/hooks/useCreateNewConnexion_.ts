import { useOnConnect } from '@/pages/BoardPage/components/Board/hooks/useOnConnect'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { getTargetHandlePosition } from '@/pages/BoardPage/configs/helpers'
import { useEdges } from '@xyflow/react'
import { useCallback } from 'react'
import { TCustomEdge } from '../../../../connexionContants'

interface Props {
  node1?: TCustomNode
  node2?: TCustomNode
}

export function useCreateNewConnexion_({ node1, node2 }: Props) {
  const edges = useEdges<TCustomEdge>()
  const onConnect = useOnConnect({ edges })

  const createEdges = useCallback(() => {
    if (!node1 || !node2) return
    const [sourceHandlePosition, targetHandlePosition] =
      getTargetHandlePosition([node1, node2])

    onConnect({
      sourceHandle: sourceHandlePosition.slice(0, 1),
      source: node1.id,
      targetHandle: targetHandlePosition.slice(0, 1),
      target: node2.id,
    })
  }, [node1, node2, onConnect])

  return createEdges
}
