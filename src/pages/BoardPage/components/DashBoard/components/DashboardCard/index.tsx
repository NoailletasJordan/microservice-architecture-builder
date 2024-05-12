import { Box, Image, Paper, Stack, Title } from '@mantine/core'
import DraggableArea from '../../../../../../components/DraggableArea'
import {
  DroppableData,
  ServiceIdType,
  serviceConfig,
} from '../../../Board/constants'

interface Props {
  serviceIdType: ServiceIdType
}

export default function DraggableDashboardCard({ serviceIdType }: Props) {
  const draggableProps: DroppableData = {
    draggableType: 'dashboard-item',
    node: {
      id: serviceIdType,
      serviceIdType: serviceIdType,
      modules: [],
      subServices: [],
    },
  }

  return (
    <DraggableArea id={serviceIdType} data={draggableProps}>
      {(dragData) => (
        <Paper
          withBorder
          p="md"
          style={{ cursor: dragData.isDragging ? 'grabbing' : 'grab' }}
        >
          <Stack align="center" gap="xs">
            <Box pos="relative">
              <Image w="4rem" src={serviceConfig[serviceIdType].imageUrl} />
              <Box pos="absolute" right="-.3rem" bottom="-1.0rem">
                <Image w="1.3rem" src="/board/plus-circle.svg" />
              </Box>
            </Box>
            <Title variant="fill" order={5}>
              {serviceConfig[serviceIdType].label}
            </Title>
          </Stack>
        </Paper>
      )}
    </DraggableArea>
  )
}
