import DroppableArea from '@/components/DroppableArea'
import DroppableIndicator from '@/components/DroppableIndicator'
import { CSSVAR } from '@/contants'
import { DraggableData, ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { useDndContext } from '@dnd-kit/core'
import { ThemeIcon } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { motion, Variants } from 'motion/react'
import { useMemo, useRef } from 'react'

interface Props {
  parentId: string
}

export default function DeleteButton({ parentId }: Props) {
  const childSubServiceIsDragged = useChildSubServiceDragged({ parentId })
  const childDraggedvariants: Variants = {
    hidden: { opacity: 0, x: -20, transitionEnd: { display: 'none' } },
    visible: { display: 'block', opacity: 1, x: 0 },
  }

  const draggedOverVariants: Variants = {
    on: { scale: 1.1, rotate: '10deg' },
    off: { scale: 1, rotate: '0deg' },
  }

  return (
    <motion.div
      variants={childDraggedvariants}
      initial={false}
      animate={childSubServiceIsDragged ? 'visible' : 'hidden'}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        left: 'calc(100% + 8px)',
        backgroundColor: CSSVAR['--surface'],
        position: 'absolute',
        padding: 4,
      }}
    >
      <DroppableIndicator
        droppableType="delete"
        padding={3}
        height={40}
        width={40}
        serviceId={parentId}
      />
      <DroppableArea
        id={`${parentId}-delete`}
        data={{
          parentId: parentId,
          droppableType: 'delete',
        }}
      >
        {({ isOver }) => (
          <motion.div
            variants={draggedOverVariants}
            initial={false}
            animate={isOver ? 'on' : 'off'}
          >
            <ThemeIcon
              component="div"
              variant="transparent"
              color={CSSVAR['--surface']}
              size="md"
              aria-label="Delete-Service"
            >
              <IconTrash
                color={CSSVAR['--text']}
                style={ICON_STYLE}
                stroke={1.5}
              />
            </ThemeIcon>
          </motion.div>
        )}
      </DroppableArea>
    </motion.div>
  )
}

function useChildSubServiceDragged({ parentId }: { parentId: string }) {
  const { active } = useDndContext()
  const current = active?.data.current as DraggableData | undefined
  const currentRef = useRef(current)
  currentRef.current = current

  const someElementIsDragged = !!current

  const childSubServiceIsDragged = useMemo(() => {
    if (!someElementIsDragged || !currentRef.current) return false
    return (
      'parentId' in currentRef.current.draggedContent &&
      currentRef.current.draggedContent.parentId === parentId
    )
  }, [someElementIsDragged, parentId])

  return childSubServiceIsDragged
}
