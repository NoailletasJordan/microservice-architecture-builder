import DraggableArea from '@/components/DraggableArea'
import {
  DraggableData,
  SubService,
  serviceConfig,
} from '@/pages/BoardPage/components/Board/constants'
import { Box, Image } from '@mantine/core'

interface Props {
  subService: SubService
}

export function DraggableSubServiceComponent({ subService }: Props) {
  const draggableProps: DraggableData = {
    draggableType: 'subService',
    node: subService,
  }

  return (
    <DraggableArea id={subService.id} data={draggableProps}>
      <SubServiceComponent subService={subService} />
    </DraggableArea>
  )
}

export function SubServiceComponent({ subService }: Props) {
  return (
    <Box style={{ border: '1px solid red' }}>
      <Image
        h="1.8rem"
        w="1.8rem"
        src={serviceConfig[subService.serviceIdType]?.imageUrl}
        alt="props.data.imageUrl"
      />
    </Box>
  )
}
