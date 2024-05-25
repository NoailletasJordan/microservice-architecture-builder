import {
  Card,
  Flex,
  Group,
  Image,
  SimpleGrid,
  Space,
  Text,
} from '@mantine/core'
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow'

import { handleDeleteNode } from '@/pages/BoardPage/helpers'
import { Box } from '@mantine/core'
import { useContext } from 'react'
import DroppableArea from '../../../../../../components/DroppableArea/index'
import selectedNodeContext from '../../../../../../selectedNodeContext'
import {
  CARD_WIDTH,
  Datatype,
  NO_DRAG_REACTFLOW_CLASS,
  TCustomNode,
  serviceConfig,
} from '../../constants'
import AddModuleMenu from './components/AddModuleMenu/index'
import DeleteButton from './components/DeleteButton'
import { DraggableModuleComponent } from './components/ModuleComponent'
import SubServiceSection from './components/SubServicesSection'
import TechnologieSelector from './components/TechnologieSelector'

const MAX_MODULES_PER_SERVICE = 6

export default function CustomNode(props: NodeProps<Datatype>) {
  const flowInstance = useReactFlow()
  const { setServiceId: setSelectedServiceId } = useContext(selectedNodeContext)

  const addNodeToContext = () => {
    const selectedNode = flowInstance.getNode(props.data.id) as TCustomNode
    setSelectedServiceId(selectedNode.id)
  }

  return (
    <DroppableArea
      id={props.id}
      data={{
        droppableType: 'node',
      }}
    >
      <Card
        onClick={addNodeToContext}
        shadow="sm"
        radius="md"
        withBorder
        w={CARD_WIDTH}
        pos="relative"
      >
        <Card.Section>
          <Group
            align="center"
            justify="space-between"
            p="xs"
            bg="#ccc"
            h="2.5rem"
          >
            <Text>{serviceConfig[props.data.serviceIdType].label}</Text>
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
          <Flex align="flex-end" gap="xs">
            <Image
              h={50}
              src={serviceConfig[props.data.serviceIdType].imageUrl}
              alt={props.data.serviceIdType}
            />
            <Box>
              <TechnologieSelector service={props.data} />
            </Box>
          </Flex>
          <Space h="md" />

          {!!props.data.subServices.length && (
            <Box>
              <SubServiceSection subServices={props.data.subServices} />
              <Space h="md" />
            </Box>
          )}

          <Box>
            {props.data.modules.length < MAX_MODULES_PER_SERVICE && (
              <AddModuleMenu serviceId={props.id} />
            )}
            <SimpleGrid cols={6} verticalSpacing="xs" spacing="xs">
              {props.data.modules.map((module) => (
                <DraggableModuleComponent key={module.id} module={module} />
              ))}
            </SimpleGrid>
          </Box>
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
        </Card.Section>
      </Card>
    </DroppableArea>
  )
}
