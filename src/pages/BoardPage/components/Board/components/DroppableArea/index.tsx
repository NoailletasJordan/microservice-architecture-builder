import { useDroppable } from '@dnd-kit/core'
import { ReactNode } from 'react'
import { DroppableType } from '../../constants'

interface Props {
  id: string
  // This will be passed in handler's event (ie. onDragEnd etc)
  data: { parentId?: string; droppableType: DroppableType }
  // children can alternatively be a function if we need the elements provided by useDroppable
  children:
    | ReactNode
    | ((useDroppableProps: ReturnType<typeof useDroppable>) => ReactNode)
}

export default function DroppableArea({ id, data, children }: Props) {
  const { setNodeRef, isOver, active, node, over, rect } = useDroppable({
    id,
    data,
  })

  const renderChildren =
    typeof children === 'function'
      ? children({ setNodeRef, isOver, active, node, over, rect })
      : children

  return <div ref={setNodeRef}>{renderChildren}</div>
}
