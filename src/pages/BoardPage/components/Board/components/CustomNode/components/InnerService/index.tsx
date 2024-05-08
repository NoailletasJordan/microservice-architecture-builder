import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Box, Image } from '@mantine/core'
import { SubService, serviceConfig } from '../../../../constants'

export default function InnerService({ ...subService }: SubService) {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: subService.id,
    data: subService,
  })
  const styleDraggable = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0 : 1, // Using DragOverlay instead
  }

  return (
    <div
      ref={setDraggableRef}
      style={styleDraggable}
      {...attributes}
      {...listeners}
    >
      <Box style={{ border: '1px solid red' }}>
        <Image
          h="1.8rem"
          src={serviceConfig[subService.serviceIdType]?.imageUrl}
          alt={subService.id}
        />
      </Box>
    </div>
  )
}
