import { Image, Paper } from '@mantine/core'
import { Handle, Node, NodeProps, Position } from 'reactflow'
import { ServiceIdType } from '../../../../utils'

interface Datatype {
  imageUrl: string
  serviceIdType: ServiceIdType
}
export type TCustomNode = Node<Datatype>

export default function CustomNode(props: NodeProps<Datatype>) {
  return (
    <Paper withBorder p="xs">
      <Image src={props.data.imageUrl} w="2rem" />
      <Handle type="source" position={Position.Left} id="l" />
      <Handle type="source" position={Position.Right} id="r" />
    </Paper>
  )
}
