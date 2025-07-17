import { DraggableData } from '@/pages/BoardPage/configs/constants'
import { DragOverlay, useDndContext } from '@dnd-kit/core'
import { Box } from '@mantine/core'
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
  }

  return (
    <DragOverlay>
      <Box style={{ cursor: 'grabbing' }}>{component}</Box>
    </DragOverlay>
  )
}
