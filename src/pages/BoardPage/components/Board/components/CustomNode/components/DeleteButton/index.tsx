import { useDndContext } from '@dnd-kit/core'
import { ActionIcon } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { CSSProperties } from 'react'
import { DraggableData } from '../../../../constants'

interface Props {
  onClick: () => void
  isOver: boolean
  parentId: string
}

const ROTATE = 'rotate(10deg)'
const SCALE = 'scale(1.2)'
const TRANSFORM_STYLE = {
  isDraggedOver: `${ROTATE} ${SCALE}`,
  isDragged: SCALE,
}

export default function DeleteButton({
  onClick,
  parentId,
  isOver: elementIsOverDeleteButton,
}: Props) {
  const { active } = useDndContext()

  const current = active?.data.current as DraggableData | undefined

  const someElementIsDragged = !!current

  const style: CSSProperties = {}
  if (someElementIsDragged) {
    const elementIsFromSameService =
      'parentId' in current.node && current.node.parentId === parentId
    style.transform = elementIsOverDeleteButton
      ? TRANSFORM_STYLE.isDraggedOver
      : elementIsFromSameService
      ? TRANSFORM_STYLE.isDragged
      : ''
  }

  return (
    <div style={{ ...style, transition: 'all 0.3s ease' }}>
      <ActionIcon
        onClick={onClick}
        variant="filled"
        color="red"
        aria-label="Settings"
        size="sm"
        className="noDragReactflow"
      >
        <IconTrash size="md" stroke={1.5} />
      </ActionIcon>
    </div>
  )
}
