import {
  ActionIcon,
  Card,
  Flex,
  Group,
  Image,
  Space,
  Switch,
  Text,
} from '@mantine/core'
import { NodeProps, Position, useReactFlow } from 'reactflow'

import SubTitle from '@/components/SubTitle'
import { selectedNodeContext } from '@/contexts/SelectedNode/constants'
import { handleDeleteNode } from '@/pages/BoardPage/helpers'
import { Box } from '@mantine/core'
import { IconBook, IconEye, IconEyeClosed } from '@tabler/icons-react'
import { useContext, useState } from 'react'
import DroppableArea from '../../../../../../components/DroppableArea/index'
import {
  CARD_WIDTH,
  ICON_STYLE,
  IService,
  NO_DRAG_REACTFLOW_CLASS,
  TCustomNode,
  serviceConfig,
} from '../../constants'
import CustomHandle from './components/CustomHandle/index'
import DeleteButton from './components/DeleteButton'
import DividerWrapper from './components/DividerWrapper'
import FullModuleSection from './components/FullModuleSection'
import { DraggableModuleIcon } from './components/ModuleIcon'
import SubServiceSection from './components/SubServicesSection'
import TechnologieEditor from './components/TechnologieSelector'

export default function CustomNode(props: NodeProps<IService>) {
  const [showFullModule, setShowFullModule] = useState(false)
  const flowInstance = useReactFlow()
  const { serviceId, setServiceId: setSelectedServiceId } =
    useContext(selectedNodeContext)

  const addNodeToContext = () => {
    const selectedNode = flowInstance.getNode(props.data.id) as TCustomNode
    setSelectedServiceId(selectedNode.id)
  }
  const isSelected = serviceId === props.data.id

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
            isSelected
              ? 'var(--mantine-primary-color-3)'
              : 'var(--mantine-color-gray-3)'
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
            bg="var(--mantine-color-gray-3)"
            h="2.5rem"
          >
            <Box>
              <ActionIcon
                className={NO_DRAG_REACTFLOW_CLASS}
                onClick={addNodeToContext}
                variant="light"
              >
                <IconBook style={ICON_STYLE} />
              </ActionIcon>
            </Box>

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
          <Flex gap="xs">
            <Image
              h={50}
              src={serviceConfig[props.data.serviceIdType].imageUrl}
              alt={props.data.serviceIdType}
            />
            <Box>
              <SubTitle>
                {serviceConfig[props.data.serviceIdType].label}
              </SubTitle>
            </Box>
          </Flex>
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
                <Text>Modules</Text>
                <Switch
                  size="xs"
                  color="dark.4"
                  onLabel={<IconEye size="xs" />}
                  offLabel={<IconEyeClosed size="xs" />}
                  checked={showFullModule}
                  onChange={(event) =>
                    setShowFullModule(event.currentTarget.checked)
                  }
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
          open={showFullModule && !!props.data.modules.length}
          service={props.data}
        />
      </Card>
    </DroppableArea>
  )
}
