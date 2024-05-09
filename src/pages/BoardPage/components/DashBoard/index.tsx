import { SimpleGrid } from '@mantine/core'
import { serviceConfig } from '../Board/constants'
import Node from './components/Item/index'

export default function Dashboard() {
  const items = Object.entries(serviceConfig).map(
    ([id, { imageUrl, label }]) => (
      <Node key={id} serviceIdType={id} imageUrl={imageUrl} label={label} />
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
