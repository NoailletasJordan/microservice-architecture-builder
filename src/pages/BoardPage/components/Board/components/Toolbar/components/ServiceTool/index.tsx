import DraggableArea from '@/components/DraggableArea'
import DraggableIndicator from '@/components/DraggableIndicator'
import {
  DraggableData,
  serviceConfig,
  ServiceIdType,
} from '@/pages/BoardPage/configs/constants'
import { Image, ThemeIcon } from '@mantine/core'

interface Props {
  serviceIdType: ServiceIdType
  draggableIndicator?: boolean
}

export function ServiceTool({ serviceIdType, draggableIndicator }: Props) {
  return (
    <ThemeIcon
      size="lg"
      variant="transparent"
      style={{
        border: '1px solid var(--mantine-color-background-6)',
      }}
    >
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
