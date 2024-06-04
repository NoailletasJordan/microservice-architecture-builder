import {
  ActionIcon,
  Card,
  Grid,
  Group,
  Image,
  Space,
  Switch,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core'
import { NodeProps, Position, useReactFlow } from 'reactflow'

import StrongText from '@/components/StrongText'
import { selectedNodeContext } from '@/contexts/SelectedNode/constants'
import {
  CARD_WIDTH,
  ICON_STYLE,
  IService,
  NO_DRAG_REACTFLOW_CLASS,
  TCustomNode,
  serviceConfig,
} from '@/pages/BoardPage/configs/constants'
import {
  handleDeleteNode,
  handleUpdateModule,
} from '@/pages/BoardPage/configs/helpers'
import { Box } from '@mantine/core'
import {
  IconClick,
  IconEye,
  IconEyeClosed,
  IconGripHorizontal,
} from '@tabler/icons-react'
import { useContext } from 'react'
import DroppableArea from '../../../../../../components/DroppableArea/index'
import AddModule from './components/AddModule'
import CustomHandle from './components/CustomHandle/index'
import DeleteButton from './components/DeleteButton'
import DividerWrapper from './components/DividerWrapper'
import EditableTitle from './components/EditableTitle'
import FullModuleSection from './components/FullModuleSection'
import { DraggableModuleIcon } from './components/ModuleIcon'
import SubServiceSection from './components/SubServicesSection'
import TechnologieEditor from './components/TechnologieSelector'

export default function CustomNode(props: NodeProps<IService>) {
  const flowInstance = useReactFlow()
  const { serviceId, setServiceId: setSelectedServiceId } =
    useContext(selectedNodeContext)

  const toggleSelectedNode = () => {
    if (serviceId === props.data.id) return setSelectedServiceId(null)
    const selectedNode = flowInstance.getNode(props.data.id) as TCustomNode
    setSelectedServiceId(selectedNode.id)
  }
  const isSelected = serviceId === props.data.id

  const theme = useMantineTheme()
  const primaryColors = theme.colors[theme.primaryColor]

  const note = props.data.modules.find(
    ({ moduleType }) => moduleType === 'markdown',
  )

  return (
    <DroppableArea
      id={props.id}
      data={{
        droppableType: 'node',
      }}
    >
      <Card
        radius="md"
        style={{
          border: `2px solid ${
            isSelected ? primaryColors[3] : theme.colors.gray[3]
          }`,
        }}
        w={CARD_WIDTH}
        pos="relative"
      >
        <Card.Section>
          <Group
            align="center"
            justify="space-between"
            px="xs"
            bg={theme.colors.gray[3]}
            h="2.5rem"
          >
            <Box>
              <ActionIcon
                className={NO_DRAG_REACTFLOW_CLASS}
                onClick={toggleSelectedNode}
                variant={isSelected ? 'filled' : 'light'}
              >
                <IconClick style={ICON_STYLE} />
              </ActionIcon>
            </Box>

            <ThemeIcon variant="transparent" color="gray">
              <IconGripHorizontal style={ICON_STYLE} />
            </ThemeIcon>

            <DroppableArea
              id={`${props.id}-delete`}
              data={{
                parentId: props.id,
                droppableType: 'delete',
              }}
            >
              {({ isOver }) => (
                <DeleteButton
                  isOver={isOver}
                  parentId={props.id}
                  onClick={() => handleDeleteNode(props.id, flowInstance)}
                />
              )}
            </DroppableArea>
          </Group>
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
                src={serviceConfig[props.data.serviceIdType].imageUrl}
                alt={props.data.serviceIdType}
              />
            </Grid.Col>
            <Grid.Col span="auto">
              <Box>
                <EditableTitle service={props.data} />
              </Box>
            </Grid.Col>
          </Grid>
          <Space h="md" />

          {props.data.technology && (
            <TechnologieEditor serviceWithTechnologie={props.data} />
          )}

          {!!props.data.subServices.length && (
            <SubServiceSection subServices={props.data.subServices} />
          )}

          {!!props.data.modules.length && (
            <DividerWrapper>
              <Group gap="xs">
                <StrongText>Modules</StrongText>
                <Switch
                  size="xs"
                  color={theme.colors[theme.primaryColor][4]}
                  onLabel={<IconEye size="xs" />}
                  offLabel={<IconEyeClosed size="xs" />}
                  checked={note?.isVisible}
                  onChange={(event) => {
                    if (!note) return

                    handleUpdateModule(
                      note.id,
                      { ...note, isVisible: event.currentTarget.checked },
                      flowInstance,
                    )
                  }}
                />
              </Group>
            </DividerWrapper>
          )}
          <Group className={NO_DRAG_REACTFLOW_CLASS} gap="sm">
            {props.data.modules.map((module) => (
              <DraggableModuleIcon key={module.id} module={module} />
            ))}
          </Group>

          <CustomHandle position={Position.Left} id="l" />
          <CustomHandle position={Position.Right} id="r" />
        </Card.Section>

        <FullModuleSection
          open={!!note?.isVisible && !!props.data.modules.length}
          service={props.data}
        />

        <AddModule
          serviceId={serviceId}
          serviceIsSelected={isSelected}
          modules={props.data.modules}
        />
      </Card>
    </DroppableArea>
  )
}
