import { useDndContext } from '@dnd-kit/core'
import { ActionIcon } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { SubService } from '../../../../constants'

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
  isOver: subserviceIsOver,
}: Props) {
  const { active } = useDndContext()

  const current = active?.data.current as SubService | undefined
  const siblingSubServiceIsDragged = current?.parentId === parentId
  const style = {
    transform: `${
      subserviceIsOver
        ? TRANSFORM_STYLE.isDraggedOver
        : siblingSubServiceIsDragged
        ? TRANSFORM_STYLE.isDragged
        : ''
    }
`,
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
