import { DragOverlay, useDndContext } from '@dnd-kit/core'
import DashboardCard from '../../../DashBoard/components/DashboardCard'
import { DroppableData } from '../../constants'
import SubServiceComponent from '../CustomNode/components/SubServiceComponent'
import { ModuleComponent } from '../ModuleComponent'

export default function DraggableGhost() {
  const { active } = useDndContext()

  const current = active?.data.current as DroppableData | undefined
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

  return <DragOverlay>{component}</DragOverlay>
}
