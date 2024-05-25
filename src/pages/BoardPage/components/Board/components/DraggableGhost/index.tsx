import { DragOverlay, useDndContext } from '@dnd-kit/core'
import { Box } from '@mantine/core'
import { DashboardCard } from '../../../DashBoard/components/DashboardCard'
import { DraggableData } from '../../constants'
import { ModuleComponent } from '../CustomNode/components/ModuleComponent'
import { SubServiceComponent } from '../CustomNode/components/SubServicesSection/components/SubServiceComponent'

export default function DraggableGhost() {
  const { active } = useDndContext()

  const current = active?.data.current as DraggableData | undefined
  if (!current) return null

  let component = null
  switch (current.draggableType) {
    case 'subService':
      component = <SubServiceComponent subService={current.node} />
      break
    case 'dashboard-item':
      component = <DashboardCard serviceIdType={current.node.serviceIdType} />
      break
    case 'module':
      component = <ModuleComponent module={current.node} />
      break
  }

  return (
    <DragOverlay>
      <Box style={{ cursor: 'grabbing' }}>{component}</Box>
    </DragOverlay>
  )
}
