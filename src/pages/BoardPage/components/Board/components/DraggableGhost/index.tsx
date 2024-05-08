import { DragOverlay, useDndContext } from '@dnd-kit/core'
import { Box, Image } from '@mantine/core'
import { SubService, serviceConfig } from '../../constants'

export default function DraggableGhost() {
  const { active } = useDndContext()

  const current = active?.data.current as SubService | undefined
  const imageLink = current ? serviceConfig[current.serviceIdType].imageUrl : ''

  return (
    <DragOverlay>
      <Box style={{ border: '1px solid red' }}>
        <Image
          h="1.8rem"
          w="1.8rem"
          src={imageLink}
          alt="props.data.imageUrl"
        />
      </Box>
    </DragOverlay>
  )
}
