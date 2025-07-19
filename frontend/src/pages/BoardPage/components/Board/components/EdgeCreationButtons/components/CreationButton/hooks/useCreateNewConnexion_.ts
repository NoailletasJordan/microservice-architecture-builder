import { useOnConnect } from '@/pages/BoardPage/components/Board/hooks/useOnConnect'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
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
    let sourceHandle, targetHandle
    if (node1.position?.x < node2.position?.x) {
      sourceHandle = 'r'
      targetHandle = 'l'
    } else {
      sourceHandle = 'l'
      targetHandle = 'r'
    }

    onConnect({
      sourceHandle,
      source: node1.id,
      targetHandle,
      target: node2.id,
    })
  }, [node1, node2, onConnect])

  return createEdges
}
