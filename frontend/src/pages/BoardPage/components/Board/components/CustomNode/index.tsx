import { Card, Grid, Image, Space } from '@mantine/core'
import {
  NodeProps,
  Position,
  useInternalNode,
  useReactFlow,
  useStore,
} from '@xyflow/react'

import DroppableIndicator from '@/components/DroppableIndicator'
import { getEditorParams } from '@/components/RichEditor'
import { CSSVAR } from '@/contants'
import {
  CARD_WIDTH,
  serviceConfig,
  TCustomNode,
} from '@/pages/BoardPage/configs/constants'
import { Box } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { useEditor } from '@tiptap/react'
import { motion } from 'motion/react'
import { useState } from 'react'
import DroppableArea from '../../../../../../components/DroppableArea/index'
import { TCustomEdge } from '../connexionContants'
import CustomHandle from './components/CustomHandle'
import EditableTitle from './components/EditableTitle'
import NoteSection from './components/NoteSection/index'
import OverlapOverlay from './components/OverlapOverlay'
import ServiceActionsWrapper from './components/ServiceActionsWrapper'
import SubServiceSection from './components/SubServicesSection'
import { useHandleNoteChange_ } from './hooks/useHandleNoteChange_'
import { useIsOverlappingNode } from './hooks/useIsOverlappingNode'
import { useLayoutIds_ } from './hooks/useLayoutIds_'

const droppableType = 'node'

export default function CustomNode(props: NodeProps<TCustomNode>) {
  // NodeProps misses rerenders on some nested changes (subservices)
  const node = useInternalNode<TCustomNode>(props.id)

  const flowInstance = useReactFlow<TCustomNode, TCustomEdge>()
  const service = node!.data!
  const [isHovered, setIsHovered] = useState(false)
  const connexion = useStore((store) => store.connection)

  const isConnexionPreviewing =
    props.id === connexion.fromNode?.id || props.id === connexion.toNode?.id

  const isHighlighted = isConnexionPreviewing || isHovered

  const { ref, height, width } = useElementSize()

  const isOverlapingNode = useIsOverlappingNode({
    nodeId: service.id,
    posX: props.positionAbsoluteX,
    posY: props.positionAbsoluteY,
  })

  const ids = useLayoutIds_({
    nodeId: service.id,
  })
  const { bodyLayoutId, imageLayout, imageLayoutId } = ids

  const handleNoteChange = useHandleNoteChange_({ serviceId: service.id })

  const editor = useEditor(
    getEditorParams({
      initialContent: service.note,
      onUpdate: handleNoteChange,
    }),
  )

  return (
    <ServiceActionsWrapper
      isHovered={isHovered}
      setIsHovered={(bool: boolean) => setIsHovered(bool)}
      flowInstance={flowInstance}
      parentId={props.id}
      handleActionClick={() => editor?.view.focus()}
    >
      <div aria-label={`node-type-${service.serviceIdType}`} ref={ref}>
        <DroppableArea
          id={props.id}
          data={{
            droppableType,
          }}
        >
          <motion.div layoutId={bodyLayoutId}>
            <Card
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              radius="md"
              style={{
                outlineColor: isHighlighted
                  ? CSSVAR['--border-strong']
                  : CSSVAR['--border'],
                outlineWidth: isHighlighted ? 2 : 1,
                outlineStyle: 'solid',
              }}
              bg={CSSVAR['--surface']}
              w={CARD_WIDTH}
            >
              <Card.Section p="md" bg={CSSVAR['--surface']}>
                {isOverlapingNode && <OverlapOverlay />}
                <Grid gutter="xs" align="center">
                  <Grid.Col span="content">
                    <motion.div
                      transition={{
                        layout: { ease: 'circOut' },
                      }}
                      layout={imageLayout}
                      layoutId={imageLayoutId}
                    >
                      <Image
                        h={40}
                        src={serviceConfig[service.serviceIdType].imageUrl}
                        alt={service.serviceIdType}
                      />
                    </motion.div>
                  </Grid.Col>
                  <Grid.Col span="auto">
                    <Box c={CSSVAR['--text-strong']}>
                      <EditableTitle service={service} />
                    </Box>
                  </Grid.Col>
                </Grid>
                {!!service.subServices.length && (
                  <>
                    <Space h="md" />
                    <SubServiceSection
                      parentId={props.id}
                      subServices={service.subServices}
                    />
                  </>
                )}
              </Card.Section>
              <NoteSection editor={editor} />
            </Card>
            <CustomHandle position={Position.Left} id="l" />
            <CustomHandle position={Position.Right} id="r" />
          </motion.div>
        </DroppableArea>
        <DroppableIndicator
          height={height}
          width={width}
          padding={5}
          droppableType={droppableType}
          serviceId={service.id}
        />
      </div>
    </ServiceActionsWrapper>
  )
}
