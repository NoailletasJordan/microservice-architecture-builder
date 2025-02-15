import DividerWrapper from '@/components/DividerWrapper'
import { CSSVAR } from '@/contants'
import {
  DraggableData,
  ICON_STYLE,
  SubService,
} from '@/pages/BoardPage/configs/constants'
import { useDndContext } from '@dnd-kit/core'
import { Box, Group, SimpleGrid, Text, ThemeIcon } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useMemo, useRef } from 'react'
import { v4 } from 'uuid'
import { DraggableSubServiceComponent } from './components/SubServiceComponent'

interface Props {
  subServices: SubService[]
  parentId: string
}

export default function SubServiceSection({ subServices, parentId }: Props) {
  return (
    <Box>
      <LayoutGroup>
        <DividerWrapper>
          <Group style={{ minHeight: 30 }}>
            <Text fw="600" size="sm">
              Internal Services
            </Text>
            {!false && <Temp parentId={parentId} />}
            {/* <AnimatePresence>
              {!true && (
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
            </AnimatePresence> */}
            {/* <DeleteSubService parentId={parentId} /> */}
          </Group>
        </DividerWrapper>
      </LayoutGroup>

      <SimpleGrid cols={4} verticalSpacing="xs">
        {subServices.map((subService: SubService) => (
          <DraggableSubServiceComponent key={v4()} subService={subService} />
        ))}
      </SimpleGrid>
    </Box>
  )
}

function Temp({ parentId }: { parentId: string }) {
  const childSubServiceIsDragged = useChildSubServiceDragged({ parentId })

  const comp = useMemo(() => {
    if (!childSubServiceIsDragged) return null

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.2 } }}
        exit={{ opacity: 0 }}
      >
        <ThemeIcon size="md" aria-label="Delete-Service">
          <IconTrash color={CSSVAR['--text']} style={ICON_STYLE} stroke={1.5} />
        </ThemeIcon>
      </motion.div>
    )
  }, [childSubServiceIsDragged])

  return <AnimatePresence mode="popLayout">{comp}</AnimatePresence>
  // return <div> {true && <Box w={10} h={10} bg="blue" />} </div>
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
