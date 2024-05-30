import { DragOverlay, useDndContext } from '@dnd-kit/core'
import { Box } from '@mantine/core'
import { DraggableData } from '../../constants'
import { ServiceTool } from '../BuilderOptions/components/ServiceTool'
import { ModuleIcon } from '../CustomNode/components/ModuleIcon'
import { SubServiceComponent } from '../CustomNode/components/SubServicesSection/components/SubServiceComponent'

export default function DraggableGhost() {
  const { active } = useDndContext()

  const current = active?.data.current as DraggableData | undefined
  if (!current) return null

  let component = null
  switch (current.draggableType) {
    case 'subService':
      component = <SubServiceComponent subService={current.draggedContent} />
      break
    case 'dashboard-item':
      component = (
        <ServiceTool serviceIdType={current.draggedContent.serviceIdType} />
      )
      break
    case 'module':
      component = <ModuleIcon module={current.draggedContent} />
      break
  }

  return (
    <DragOverlay>
      <Box style={{ cursor: 'grabbing' }}>{component}</Box>
    </DragOverlay>
  )
}
