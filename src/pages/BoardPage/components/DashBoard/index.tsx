import { SimpleGrid } from '@mantine/core'
import { ServiceIdType, serviceConfig } from '../../../../utils'
import Node from './components/Item/index'

interface Props {
  addNewNode: (serviceIdType: ServiceIdType) => () => void
}

export default function Dashboard({ addNewNode }: Props) {
  const items = Object.entries(serviceConfig).map(
    ([id, { imageUrl, label }]) => (
      <Node
        key={id}
        handleClick={addNewNode(id as ServiceIdType)}
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
