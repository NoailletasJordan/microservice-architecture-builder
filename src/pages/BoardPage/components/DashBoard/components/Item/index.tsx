import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Box, Image, Paper, Stack, Title } from '@mantine/core'
import { Datatype, DraggableData } from '../../../Board/constants'

interface Props {
  serviceIdType: string
  imageUrl: string
  label: string
}

export default function Item({ serviceIdType, imageUrl, label }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: serviceIdType,
    data: {
      draggableType: 'dashboard-item',
      node: {
        id: serviceIdType,
        imageUrl,
        serviceIdType: serviceIdType,
        subServices: [],
        modules: [],
      },
    } as DraggableData<Datatype>,
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
      <ItemNode imageUrl={imageUrl} label={label} isActive={isDragging} />
    </div>
  )
}

interface ItemNodeProps {
  label: string
  imageUrl: string
  isActive: boolean
}
export function ItemNode({ imageUrl, label, isActive }: ItemNodeProps) {
  return (
    <Paper withBorder p="md" style={{ cursor: isActive ? 'grabbing' : 'grab' }}>
      <Stack align="center" gap="xs">
        <Box pos="relative">
          <Image w="4rem" src={imageUrl} />
          <Box pos="absolute" right="-.3rem" bottom="-1.0rem">
            <Image w="1.3rem" src="/board/plus-circle.svg" />
          </Box>
        </Box>
        <Title variant="fill" order={5}>
          {label}
        </Title>
      </Stack>
    </Paper>
  )
}
