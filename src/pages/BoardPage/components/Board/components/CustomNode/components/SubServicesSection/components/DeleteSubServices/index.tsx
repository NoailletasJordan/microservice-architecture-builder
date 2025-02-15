import { CSSVAR } from '@/contants'
import { DraggableData, ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { useDndContext } from '@dnd-kit/core'
import { ThemeIcon } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useRef } from 'react'

interface Props {
  parentId: string
}

export default function DeleteSubService({ parentId }: Props) {
  const childSubServiceIsDragged = useChildSubServiceDragged({ parentId })

  return (
    <AnimatePresence mode="popLayout">
      {childSubServiceIsDragged && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2 } }}
          exit={{ opacity: 0 }}
        >
          <ThemeIcon size="md" aria-label="Delete-Service">
            <IconTrash
              color={CSSVAR['--text']}
              style={ICON_STYLE}
              stroke={1.5}
            />
          </ThemeIcon>
        </motion.div>
      )}
    </AnimatePresence>
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
  console.log(':', { childSubServiceIsDragged })

  return childSubServiceIsDragged
}
