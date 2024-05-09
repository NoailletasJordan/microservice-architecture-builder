import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Box, Image } from '@mantine/core'
import { DraggableData, SubService, serviceConfig } from '../../../../constants'

export default function InnerService({ ...subService }: SubService) {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: subService.id,
    data: {
      draggableType: 'subService',
      node: subService,
    } as DraggableData<SubService>,
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
      <SubServiceIcon
        imageLink={serviceConfig[subService.serviceIdType]?.imageUrl}
      />
    </div>
  )
}

export function SubServiceIcon({ imageLink }: { imageLink: string }) {
  return (
    <Box style={{ border: '1px solid red' }}>
      <Image h="1.8rem" w="1.8rem" src={imageLink} alt="props.data.imageUrl" />
    </Box>
  )
}
