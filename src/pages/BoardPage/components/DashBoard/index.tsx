import { SimpleGrid } from '@mantine/core'
import { useReactFlow } from 'reactflow'
import { ServiceIdType, serviceConfig } from '../../../../utils'
import { addNewNode } from '../Board/helpers'
import Node from './components/Item/index'

export default function Dashboard() {
  const flow = useReactFlow()

  const items = Object.entries(serviceConfig).map(
    ([id, { imageUrl, label }]) => (
      <Node
        key={id}
        handleClick={() => addNewNode(id as ServiceIdType, flow.setNodes)}
        imageUrl={imageUrl}
        label={label}
      />
    ),
  )

  return (
    <>
      <div>Dashboard</div>
      <SimpleGrid cols={2} spacing="xs">
        {items}
      </SimpleGrid>
    </>
  )
}
