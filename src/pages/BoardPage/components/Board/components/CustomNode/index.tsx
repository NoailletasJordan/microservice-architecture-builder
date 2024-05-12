import {
  Badge,
  Card,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core'
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow'
import { v4 } from 'uuid'

import { handleDeleteNode } from '@/pages/BoardPage/helpers'
import { useContext } from 'react'
import DroppableArea from '../../../../../../components/DroppableArea/index'
import selectedNodeContext from '../../../../../../selectedNodeContext'
import {
  CARD_WIDTH,
  Datatype,
  NO_DRAG_REACTFLOW_CLASS,
  SubService,
  TCustomNode,
  serviceConfig,
} from '../../constants'
import { DraggableModuleComponent } from '../ModuleComponent'
import AddModuleMenu from './components/AddModuleMenu/index'
import DeleteButton from './components/DeleteButton'
import SubServiceComponent from './components/SubServiceComponent'

const MAX_MODULES_PER_SERVICE = 6

export default function CustomNode(props: NodeProps<Datatype>) {
  const flowInstance = useReactFlow()
  const { setNode: setSelectedNode, openSelectedNodeSection } =
    useContext(selectedNodeContext)

  const addNodeToContext = () => {
    const selectedNode = flowInstance.getNode(props.data.id) as TCustomNode
    setSelectedNode(selectedNode)
    openSelectedNodeSection()
  }

  return (
    <DroppableArea
      id={props.id}
      data={{
        droppableType: 'node',
      }}
    >
      <Card
        shadow="sm"
        radius="md"
        withBorder
        miw={CARD_WIDTH}
        maw={CARD_WIDTH}
        pos="relative"
      >
        <Card.Section>
          <Group
            justify="flex-end"
            p="xs"
            style={{ backgroundColor: '#ccc' }}
            h="2.5rem"
          >
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
          className={NO_DRAG_REACTFLOW_CLASS}
          style={{ cursor: 'default' }}
        >
          <Group align="flex-end" gap="xs">
            <Image
              h={70}
              src={serviceConfig[props.data.serviceIdType].imageUrl}
              alt={props.data.serviceIdType}
            />

            <SimpleGrid cols={3} verticalSpacing="xs" spacing="xs">
              {props.data.subServices.map((subService: SubService) => (
                <SubServiceComponent key={v4()} subService={subService} />
              ))}
            </SimpleGrid>
          </Group>

          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>
              {serviceConfig[props.data.serviceIdType].label}
            </Text>
            {/* TODO */}
            <Badge color="red">Status</Badge>
          </Group>

          <Handle
            style={{ width: 20, height: 20 }}
            type="source"
            position={Position.Left}
            id="l"
          />
          <Handle
            style={{ width: 20, height: 20 }}
            type="source"
            position={Position.Right}
            id="r"
          />

          <Stack align="flex-start">
            <Text
              onClick={addNodeToContext}
              fw={500}
              c="blue"
              style={{ cursor: 'pointer' }}
            >
              {'Modules >'}
            </Text>

            <SimpleGrid cols={6}>
              {props.data.modules.map((module) => (
                <DraggableModuleComponent key={module.id} module={module} />
              ))}
              {props.data.modules.length < MAX_MODULES_PER_SERVICE && (
                <AddModuleMenu serviceId={props.id} />
              )}
            </SimpleGrid>
          </Stack>
        </Card.Section>
      </Card>
    </DroppableArea>
  )
}
