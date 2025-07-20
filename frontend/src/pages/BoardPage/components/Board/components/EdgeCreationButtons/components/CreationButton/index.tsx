import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { Button } from '@mantine/core'
import { useHover } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { useInternalNode } from '@xyflow/react'
import { useCreateNewConnexion_ } from './hooks/useCreateNewConnexion_'
import { useHandleConnexionPreview_ } from './hooks/useHandleConnexionPreview_'
import { useIsMouseLeftDown } from './hooks/useIsMouseLeftDown'
import { usePosition_ } from './hooks/usePosition_'

type NodeId = string
interface Props {
  duet: [NodeId, NodeId]
}

export default function EdgeCreationButton({ duet }: Props) {
  const [sourceId, targetId] = duet
  const { ref } = useHandleConnexionPreview_({ duet })
  const node1 = useInternalNode<TCustomNode>(sourceId)
  const node2 = useInternalNode<TCustomNode>(targetId)

  const position = usePosition_({ node1, node2 })

  const createNewEdge = useCreateNewConnexion_({ node1, node2 })

  const { hovered, ref: hitboxRef } = useHover()

  // to not break ui when hovering creation button
  const isMouseDown = useIsMouseLeftDown()

  return (
    <div
      ref={hitboxRef}
      style={{
        display: isMouseDown ? 'none' : 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
        cursor: 'pointer',
        pointerEvents: 'auto',
        position: 'absolute',
        minWidth: 70,
        height: 70,
        top: position.y,
        left: position.x,
        transform: `translate(-50%, -50%)`,
        opacity: hovered ? 1 : 0,
      }}
    >
      <Button
        color="blue"
        variant="light"
        leftSection={<IconPlus />}
        radius="xl"
        onClick={createNewEdge}
        ref={ref}
      >
        Create connexion
      </Button>
    </div>
  )
}
