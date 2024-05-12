import { SimpleGrid } from '@mantine/core'
import { ServiceIdType, serviceConfig } from '../Board/constants'
import DashboardCard from './components/DashboardCard/index'

export default function Dashboard() {
  const items = Object.entries(serviceConfig).map(([serviceIdType]) => (
    <DashboardCard
      key={serviceIdType}
      serviceIdType={serviceIdType as ServiceIdType}
    />
  ))

  return (
    <>
      <div>Dashboard</div>
      <SimpleGrid cols={2} spacing="xs">
        {items}
      </SimpleGrid>
    </>
  )
}
