import DraggableArea from '@/components/DraggableArea'
import {
  DraggableData,
  SubService,
} from '@/pages/BoardPage/components/Board/constants'
import { ServiceTool } from '../../../../../Toolbar/components/ServiceTool'

interface Props {
  subService: SubService
}

export function DraggableSubServiceComponent({ subService }: Props) {
  const draggableProps: DraggableData = {
    draggableType: 'subService',
    draggedContent: subService,
  }

  return (
    <DraggableArea id={subService.id} data={draggableProps}>
      <SubServiceComponent subService={subService} />
    </DraggableArea>
  )
}

export function SubServiceComponent({ subService }: Props) {
  return <ServiceTool serviceIdType={subService.serviceIdType} />
}
