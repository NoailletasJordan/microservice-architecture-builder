import DraggableArea from '@/components/DraggableArea'
import DraggableIndicator from '@/components/DraggableIndicator'
import { CSSVAR } from '@/contants'
import {
  DraggableData,
  NO_DRAG_REACTFLOW_CLASS,
  serviceConfig,
  ServiceIdType,
  SubService,
} from '@/pages/BoardPage/configs/constants'
import { Image, ThemeIcon } from '@mantine/core'

interface Props {
  subService: SubService
}

export function DraggableSubServiceComponent({ subService }: Props) {
  const draggableProps: DraggableData = {
    draggableType: 'subService',
    draggedContent: subService,
  }

  return (
    <div className={NO_DRAG_REACTFLOW_CLASS}>
      <DraggableArea id={subService.id} data={draggableProps}>
        {() => {
          return <SubServiceComponent subService={subService} />
        }}
      </DraggableArea>
    </div>
  )
}

export function SubServiceComponent({ subService }: Props) {
  return (
    <ServiceTool serviceIdType={subService.serviceIdType} draggableIndicator />
  )
}

interface ServiceToolProps {
  serviceIdType: ServiceIdType
  draggableIndicator?: boolean
}
function ServiceTool({ serviceIdType, draggableIndicator }: ServiceToolProps) {
  return (
    <ThemeIcon
      size="xl"
      data-testid={`icon-draggable-${serviceIdType}`}
      variant="transparent"
      style={{
        border: `1px solid ${CSSVAR['--border']}`,
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
