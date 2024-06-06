import DroppableArea from '@/components/DroppableArea'
import DroppableIndicator from '@/components/DroppableIndicator'
import { DraggableData, ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { useDndContext } from '@dnd-kit/core'
import { ActionIcon, Box } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { IconTrash } from '@tabler/icons-react'
import { CSSProperties } from 'react'

interface Props {
  onClick: () => void
  parentId: string
}

const ROTATE = 'rotate(10deg)'
const SCALE = 'scale(1.2)'
const TRANSFORM_STYLE = {
  isDraggedOver: `${ROTATE} ${SCALE}`,
  isDragged: SCALE,
}

export default function DeleteButtonWithIndicator(props: Props) {
  const { ref, height, width } = useElementSize()
  const droppableType = 'delete'
  return (
    <Box ref={ref} pos="relative">
      <DroppableIndicator
        droppableType={droppableType}
        height={height}
        padding={0}
        width={width}
        serviceId={props.parentId}
      />
      <DroppableArea
        id={`${props.parentId}-delete`}
        data={{
          parentId: props.parentId,
          droppableType,
        }}
      >
        {({ isOver }) => <DeleteButton isOver={isOver} {...props} />}
      </DroppableArea>
    </Box>
  )
}

function DeleteButton({
  onClick,
  parentId,
  isOver: elementIsOverDeleteButton,
}: Props & { isOver: boolean }) {
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
