import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  Group,
  Image,
  Stack,
  Text,
} from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useCallback } from 'react'
import { Handle, Node, NodeProps, Position, useReactFlow } from 'reactflow'
import { ServiceIdType, serviceConfig } from '../../../../utils'

interface Datatype {
  imageUrl: string
  serviceIdType: ServiceIdType
}
export type TCustomNode = Node<Datatype>

const CARD_WIDTH = 230
export default function CustomNode(props: NodeProps<Datatype>) {
  const { setNodes } = useReactFlow()

  const handleDelete = useCallback(() => {
    setNodes((oldNodes) =>
      oldNodes.filter((compNode) => compNode.id != props.id),
    )
  }, [setNodes, props.id])

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      miw={CARD_WIDTH}
      maw={CARD_WIDTH}
    >
      <Flex justify="space-between">
        <Image h={80} src={props.data.imageUrl} alt={props.data.imageUrl} />
        <Stack>
          <ActionIcon
            onClick={handleDelete}
            variant="filled"
            color="red"
            aria-label="Settings"
            size="sm"
          >
            <IconTrash size="md" stroke={1.5} />
          </ActionIcon>
        </Stack>
      </Flex>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{serviceConfig[props.data.serviceIdType].label}</Text>
        {/* TODO */}
        <Badge color="red">Status</Badge>
      </Group>

      <Handle type="source" position={Position.Left} id="l" />
      <Handle type="source" position={Position.Right} id="r" />
    </Card>
  )
}
