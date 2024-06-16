import {
  ActionIcon,
  Card,
  Grid,
  Group,
  Image,
  Space,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core'
import { NodeProps, Position, useReactFlow } from 'reactflow'

import DroppableIndicator from '@/components/DroppableIndicator'
import { getEditorParams } from '@/components/RichEditor'
import TooltipWrapper from '@/components/TooltipWrapper'
import {
  CARD_WIDTH,
  ICON_STYLE,
  IService,
  NO_DRAG_REACTFLOW_CLASS,
  serviceConfig,
} from '@/pages/BoardPage/configs/constants'
import {
  getNodeOverlapped,
  handleDeleteNode,
  handleUpdateNode,
} from '@/pages/BoardPage/configs/helpers'
import { Box } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { IconGripHorizontal, IconNote } from '@tabler/icons-react'
import { useEditor } from '@tiptap/react'
import { useMemo } from 'react'
import DroppableArea from '../../../../../../components/DroppableArea/index'
import CustomHandle from './components/CustomHandle/index'
import DeleteButton from './components/DeleteButton'
import EditableTitle from './components/EditableTitle'
import NoteSection from './components/NoteSection/index'
import OverlapOverlay from './components/OverlapOverlay'
import SubServiceSection from './components/SubServicesSection'

export default function CustomNode(props: NodeProps<IService>) {
  const flowInstance = useReactFlow()
  const theme = useMantineTheme()
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
            border: `2px solid ${theme.colors.gray[3]}`,
          }}
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
              bg={theme.colors.gray[3]}
              h="2.5rem"
            >
              <TooltipWrapper label="Add a note">
                <Box mt={4}>
                  <ActionIcon
                    onClick={() => editor?.commands.focus()}
                    className={NO_DRAG_REACTFLOW_CLASS}
                    variant="subtle"
                    color="gray"
                  >
                    <IconNote style={ICON_STYLE} />
                  </ActionIcon>
                </Box>
              </TooltipWrapper>

              <ThemeIcon variant="transparent" color="gray">
                <IconGripHorizontal style={ICON_STYLE} />
              </ThemeIcon>
              <DeleteButton
                parentId={props.id}
                onClick={() => handleDeleteNode(props.id, flowInstance)}
              />
            </Group>
            {isOverlapingNode && <OverlapOverlay />}
          </Card.Section>
          <Card.Section
            p="md"
            pb="xs"
            className={NO_DRAG_REACTFLOW_CLASS}
            style={{ cursor: 'default' }}
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
                <Box>
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
  )
}
