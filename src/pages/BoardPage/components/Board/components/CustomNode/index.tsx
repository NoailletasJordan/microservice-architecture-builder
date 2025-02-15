import {
  Card,
  Divider,
  Grid,
  Group,
  Image,
  Space,
  ThemeIcon,
} from '@mantine/core'
import { NodeProps, Position, useReactFlow } from 'reactflow'

import DroppableIndicator from '@/components/DroppableIndicator'
import { getEditorParams } from '@/components/RichEditor'
import { CSSVAR } from '@/contants'
import {
  CARD_WIDTH,
  ICON_STYLE,
  IService,
  NO_DRAG_REACTFLOW_CLASS,
  serviceConfig,
} from '@/pages/BoardPage/configs/constants'
import {
  getNodeOverlapped,
  handleUpdateNode,
} from '@/pages/BoardPage/configs/helpers'
import { Box } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { IconGripHorizontal } from '@tabler/icons-react'
import { useEditor } from '@tiptap/react'
import { useMemo } from 'react'
import DroppableArea from '../../../../../../components/DroppableArea/index'
import CustomHandle from './components/CustomHandle/index'
import EditableTitle from './components/EditableTitle'
import NoteSection from './components/NoteSection/index'
import OverlapOverlay from './components/OverlapOverlay'
import ServiceActionsWrapper from './components/ServiceActionsWrapper'
import SubServiceSection from './components/SubServicesSection'

export default function CustomNode(props: NodeProps<IService>) {
  const flowInstance = useReactFlow()
  const { ref, height, width } = useElementSize()
  const service = props.data

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
    const nodeToEdit = flowInstance.getNode(service.id)!
    nodeToEdit.data.note = newNote
    handleUpdateNode(service.id, nodeToEdit, flowInstance)
  }

  const editor = useEditor(
    getEditorParams({
      initialContent: service.note,
      onUpdate: handleNoteChange,
    }),
  )

  return (
    <ServiceActionsWrapper flowInstance={flowInstance} parentId={props.id}>
      <DroppableArea
        id={props.id}
        data={{
          droppableType,
        }}
      >
        <Box ref={ref}>
          <Card
            radius="md"
            style={{
              border: `1px solid ${CSSVAR['--border']}`,
            }}
            bg={CSSVAR['--surface']}
            w={CARD_WIDTH}
            pos="relative"
          >
            <Card.Section>
              <DroppableIndicator
                height={height}
                width={width}
                padding={5}
                droppableType={droppableType}
                serviceId={service.id}
              />
              <Group
                align="center"
                justify="space-between"
                px="xs"
                bg={CSSVAR['--surface']}
                h="2.5rem"
              >
                <ThemeIcon variant="transparent" color="gray">
                  <IconGripHorizontal style={ICON_STYLE} />
                </ThemeIcon>
              </Group>
              <Space h="0.2rem" />
              {isOverlapingNode && <OverlapOverlay />}
            </Card.Section>
            <Card.Section bg={CSSVAR['--border']}>
              <Divider bg={CSSVAR['--border']} />
            </Card.Section>
            <Card.Section
              p="md"
              pb="xs"
              className={NO_DRAG_REACTFLOW_CLASS}
              style={{ cursor: 'default' }}
              bg={CSSVAR['--surface']}
            >
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
              <Space h="md" />
              {!!service.subServices.length && (
                <SubServiceSection subServices={service.subServices} />
              )}
              <CustomHandle position={Position.Left} id="l" />
              <CustomHandle position={Position.Right} id="r" />
            </Card.Section>
            <NoteSection editor={editor} />
          </Card>
        </Box>
      </DroppableArea>
    </ServiceActionsWrapper>
  )
}
