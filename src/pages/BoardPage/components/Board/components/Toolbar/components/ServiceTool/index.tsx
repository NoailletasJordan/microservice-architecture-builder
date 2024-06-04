import DraggableArea from '@/components/DraggableArea'
import DraggableIndicator from '@/components/DraggableIndicator'
import {
  DraggableData,
  ServiceIdType,
  serviceConfig,
} from '@/pages/BoardPage/configs/constants'
import { Image, ThemeIcon } from '@mantine/core'

interface Props {
  serviceIdType: ServiceIdType
  draggableIndicator?: boolean
}

export function ServiceTool({ serviceIdType, draggableIndicator }: Props) {
  return (
    <ThemeIcon size="lg" color="gray" variant="default">
      <Image
        h={25}
        w={25}
        src={serviceConfig[serviceIdType].imageUrl}
        alt="frontend"
      />
      {draggableIndicator && <DraggableIndicator />}
    </ThemeIcon>
  )
}

export function DraggableServiceTool(props: Props) {
  const { serviceIdType } = props
  const draggableProps: DraggableData = {
    draggableType: 'dashboard-item',
    draggedContent: {
      serviceIdType: serviceIdType,
    },
  }
  return (
    <DraggableArea id={serviceIdType} data={draggableProps}>
      <ServiceTool {...props} />
    </DraggableArea>
  )
}
