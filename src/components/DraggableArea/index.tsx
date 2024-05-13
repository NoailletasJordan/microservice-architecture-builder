import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { ReactNode } from 'react'
import { DraggableData } from '../../pages/BoardPage/components/Board/constants'

interface Props {
  id: string
  // This will be passed in handler's event (ie. onDragEnd etc)
  data: DraggableData

  children:
    | ReactNode
    | ((useDroppableProps: ReturnType<typeof useDraggable>) => ReactNode)
}

export default function DraggableArea({ id, data, children }: Props) {
  const draggableData = useDraggable({
    id,
    data,
  })

  const renderChildren =
    typeof children === 'function' ? children(draggableData) : children

  return (
    <div
      ref={draggableData.setNodeRef}
      style={{
        transform: CSS.Transform.toString(draggableData.transform),
        opacity: draggableData.isDragging ? 0 : 1, // Using DragOverlay instead
        cursor: 'grab',
      }}
      {...draggableData.listeners}
      {...draggableData.attributes}
    >
      {renderChildren}
    </div>
  )
}
