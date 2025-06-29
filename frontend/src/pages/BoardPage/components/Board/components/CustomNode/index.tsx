import { Card, Grid, Image, Space } from '@mantine/core'
import { NodeProps, Position, useReactFlow } from 'reactflow'

import DroppableIndicator from '@/components/DroppableIndicator'
import { getEditorParams } from '@/components/RichEditor'
import { CSSVAR } from '@/contants'
import { boardDataContext } from '@/contexts/BoardData/constants'
import {
  CARD_WIDTH,
  IService,
  serviceConfig,
} from '@/pages/BoardPage/configs/constants'
import {
  getNodeOverlapped,
  getNodesAfterUpdateNode,
} from '@/pages/BoardPage/configs/helpers'
import { Box } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { useEditor } from '@tiptap/react'
import { useContext, useMemo, useState } from 'react'
import DroppableArea from '../../../../../../components/DroppableArea/index'
import CustomHandle from './components/CustomHandle'
import EditableTitle from './components/EditableTitle'
import NoteSection from './components/NoteSection/index'
import OverlapOverlay from './components/OverlapOverlay'
import ServiceActionsWrapper from './components/ServiceActionsWrapper'
import SubServiceSection from './components/SubServicesSection'

export default function CustomNode(props: NodeProps<IService>) {
  const flowInstance = useReactFlow()
  // Ineficient, but NodeProps misses rerenders on some nested changes (subservices)
  const { nodes: _forceRerender } = useContext(boardDataContext)
  const service = props.data

  const [isHovered, setIsHovered] = useState(false)
  const { ref, height, width } = useElementSize()
  const isOverlapingNode = useMemo(
    () =>
      !!getNodeOverlapped(
        flowInstance.getNode(props.id)!,
        flowInstance.getNodes(),
      ),
    [flowInstance, props],
  )

  const droppableType = 'node'

  const handleNoteChange = (newNote: string) => {
    const currentNodes = flowInstance.getNodes()
    const nodeToEdit = flowInstance.getNode(service.id)!
    nodeToEdit.data.note = newNote
    getNodesAfterUpdateNode({ currentNodes, newNode: nodeToEdit })
  }

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
      <Box aria-label={`node-type-${service.serviceIdType}`} ref={ref}>
        <DroppableArea
          id={props.id}
          data={{
            droppableType,
          }}
        >
          <Card
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            radius="md"
            style={{
              outlineColor: isHovered
                ? CSSVAR['--border-strong']
                : CSSVAR['--border'],
              outlineWidth: isHovered ? 2 : 1,
              outlineStyle: 'solid',
            }}
            bg={CSSVAR['--surface']}
            w={CARD_WIDTH}
          >
            <Card.Section p="md" bg={CSSVAR['--surface']}>
              {isOverlapingNode && <OverlapOverlay />}
              <Grid gutter="xs" align="center">
                <Grid.Col span="content">
                  <Image
                    h={40}
                    src={serviceConfig[service.serviceIdType].imageUrl}
                    alt={service.serviceIdType}
                  />
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
        </DroppableArea>
        <DroppableIndicator
          height={height}
          width={width}
          padding={5}
          droppableType={droppableType}
          serviceId={service.id}
        />
      </Box>
    </ServiceActionsWrapper>
  )
}
