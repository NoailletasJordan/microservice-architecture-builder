import DraggableArea from '@/components/DraggableArea'
import TooltipWrapper from '@/components/TooltipWrapper'
import { Image, ThemeIcon } from '@mantine/core'
import {
  DraggableData,
  ServiceIdType,
  serviceConfig,
} from '../../../../constants'

interface Props {
  serviceIdType: ServiceIdType
}

export function ServiceTool({ serviceIdType }: Props) {
  return (
    <TooltipWrapper
      label={serviceConfig[serviceIdType].label}
      position="bottom"
    >
      <ThemeIcon size="lg" color="gray" variant="default" aria-label="Settings">
        <Image
          h={25}
          w={25}
          src={serviceConfig[serviceIdType].imageUrl}
          alt="frontend"
        />
      </ThemeIcon>
    </TooltipWrapper>
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
