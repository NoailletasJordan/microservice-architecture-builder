import { DraggableData, ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { useDndContext } from '@dnd-kit/core'
import { ActionIcon } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { CSSProperties } from 'react'

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
      'parentId' in current.draggedContent &&
      current.draggedContent.parentId === parentId
    style.transform = elementIsOverDeleteButton
      ? TRANSFORM_STYLE.isDraggedOver
      : elementIsFromSameService
      ? TRANSFORM_STYLE.isDragged
      : ''
  }

  return (
    <div style={{ ...style, transition: 'all 0.3s ease' }}>
      <ActionIcon
        onClick={(event) => {
          event.stopPropagation()
          onClick()
        }}
        variant="subtle"
        color="gray"
        aria-label="Settings"
        className="noDragReactflow"
      >
        <IconTrash style={ICON_STYLE} />
      </ActionIcon>
    </div>
  )
}
