import DraggableArea from '@/components/DraggableArea'
import {
  DraggableData,
  NO_DRAG_REACTFLOW_CLASS,
  SubService,
} from '@/pages/BoardPage/configs/constants'
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
