import { CSSVAR, themeDarkColorVariables } from '@/contants'
import OnboardingContextProvider from '@/contexts/Onboarding/OnboardingProvider'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { AppShell, Modal, Space, Text } from '@mantine/core'
import { motion, Transition } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useEdgesState, useNodesState, useReactFlow } from 'reactflow'
import ClickCanvaProvider from '../../contexts/ClickCanvaCapture/ClickCanvaProvider'
import Board from './components/Board'
import { DroppableType } from './configs/constants'
import { onDragEndConfig } from './configs/drag-handlers'
import { getInitialBoardData } from './configs/helpers'

export default function BoardPage() {
  const flowInstance = useReactFlow()
  const { nodes: initialnodes, edges: initialEdges } = useMemo(
    () => getInitialBoardData(),
    [],
  )
  const nodeState = useNodesState(initialnodes)
  const edgeState = useEdgesState(initialEdges)

  const [nodes] = nodeState

  const [openLoader, setOpenLoader] = useState(true)

  return (
    <AppShell>
      <DndContext
        onDragEnd={(e: DragEndEvent) => {
          if (!e.over) return

          const type = e.over.data.current?.droppableType as
            | DroppableType
            | undefined
          if (!type) return

          onDragEndConfig[type](e, flowInstance)
        }}
      >
        <AppShell.Main>
          <ClickCanvaProvider>
            <OnboardingContextProvider nodes={nodes}>
              <Board
                showInitialLoader={openLoader}
                edgeState={edgeState}
                nodeState={nodeState}
              />
              {/* temp */}
              {/* <LoaderModal
                close={() => setOpenLoader(false)}
                isOpen={openLoader}
              /> */}
            </OnboardingContextProvider>
          </ClickCanvaProvider>
        </AppShell.Main>
      </DndContext>
    </AppShell>
  )
}

function LoaderModal({
  close,
  isOpen,
}: {
  isOpen: boolean
  close: () => void
}) {
  const transition: Transition = { duration: 0.7, ease: 'circIn' }
  return (
    <Modal
      transitionProps={{ transition: 'fade' }}
      onClose={close}
      styles={{
        root: { color: themeDarkColorVariables['--text'] },
        header: {
          background: themeDarkColorVariables['--surface'],
          borderBottom: `1px solid ${themeDarkColorVariables['--border']}`,
        },
        close: {
          color: themeDarkColorVariables['--text'],
        },
        content: {
          color: themeDarkColorVariables['--text'],
          background: themeDarkColorVariables['--surface'],
          border: `1px solid ${themeDarkColorVariables['--border']}`,
          display: 'grid',
        },
      }}
      opened={isOpen}
      fullScreen
      withCloseButton={false}
      centered
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text component="span" size="60px" fw={700}>
          <motion.div
            initial={{
              opacity: 0,
              transform: 'translateX(-100px)',
            }}
            animate={{
              transform: 'translateX(-60px)',
              opacity: 1,
            }}
            transition={{ ...transition, delay: 0.1 }}
          >
            Microservice
          </motion.div>
          <Space h="sm" />
          <motion.div
            transition={{ ...transition, delay: 0.4 }}
            style={{ color: CSSVAR['--text-primary'] }}
            initial={{
              opacity: 0,
              transform: 'translateX(-100px)',
            }}
            animate={{
              transform: 'translateX(0px)',
              opacity: 1,
            }}
          >
            Architecture
          </motion.div>
          <Space h="sm" />
          <motion.div
            onAnimationComplete={() => {
              setTimeout(() => {
                close()
              }, 100)
            }}
            initial={{
              opacity: 0,
              transform: 'translateX(-100px)',
            }}
            animate={{
              transform: 'translateX(60px)',
              opacity: 1,
            }}
            transition={{ ...transition, delay: 0.7 }}
          >
            Builder
          </motion.div>
        </Text>
      </div>
    </Modal>
  )
}
