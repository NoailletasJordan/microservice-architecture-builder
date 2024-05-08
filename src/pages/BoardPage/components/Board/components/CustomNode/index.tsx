import { Badge, Card, Group, Image, SimpleGrid, Text } from '@mantine/core'
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow'
import { v4 } from 'uuid'

import {
  CARD_WIDTH,
  Datatype,
  SubService,
  serviceConfig,
} from '../../constants'
import { handleDeleteNode } from '../../helpers'
import DroppableArea from '../DroppableArea/index'
import DeleteButton from './components/DeleteButton'
import InnerService from './components/InnerService'

export default function CustomNode(props: NodeProps<Datatype>) {
  const flowInstance = useReactFlow()

  return (
    <DroppableArea
      id={props.id}
      data={{
        type: 'node',
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
                type: 'delete',
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
          className="noDragReactflow"
          style={{ cursor: 'default' }}
        >
          <Group align="flex-end" gap="xs">
            <Image h={70} src={props.data.imageUrl} alt={props.data.imageUrl} />

            <SimpleGrid cols={3} verticalSpacing="xs" spacing="xs">
              {props.data.subServices.map((subService: SubService) => (
                <InnerService key={v4()} {...subService} />
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

          <Handle type="source" position={Position.Left} id="l" />
          <Handle type="source" position={Position.Right} id="r" />
        </Card.Section>
      </Card>
    </DroppableArea>
  )
}
