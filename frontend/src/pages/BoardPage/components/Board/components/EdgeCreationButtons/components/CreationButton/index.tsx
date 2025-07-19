import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useInternalNode } from '@xyflow/react'
import { useCreateNewConnexion_ } from './hooks/useCreateNewConnexion_'
import { useHandleConnexionPreview_ } from './hooks/useHandleConnexionPreview_'
import { usePosition_ } from './hooks/usePosition_'

interface Props {
  duet: [string, string]
}

export default function EdgeCreationButton({ duet }: Props) {
  const [sourceId, targetId] = duet
  const { ref } = useHandleConnexionPreview_({ duet })
  const node1 = useInternalNode<TCustomNode>(sourceId)
  const node2 = useInternalNode<TCustomNode>(targetId)

  const position = usePosition_({ node1, node2 })

  const createNewEdge = useCreateNewConnexion_({ node1, node2 })

  return (
    <div
      ref={ref}
      onClick={createNewEdge}
      style={{
        cursor: 'pointer',
        pointerEvents: 'auto',
        position: 'absolute',
        width: 50,
        height: 50,
        top: position.y,
        left: position.x,
        transform: `translate(-50%, -50%)`,
        border: '1px solid red',
      }}
    ></div>
  )
}
