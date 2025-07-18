import OnboardingContextProvider from '@/contexts/Onboarding/Provider'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { AppShell } from '@mantine/core'
import { useReactFlow } from '@xyflow/react'
import ClickCanvaProvider from '../../contexts/ClickCanvaCapture/ClickCanvaProvider'
import Board from './components/Board'
import { TCustomEdge } from './components/Board/components/connexionContants'
import { DroppableType, TCustomNode } from './configs/constants'
import { onDragEndConfig } from './configs/drag-handlers'

export default function BoardPage() {
  const flowInstance = useReactFlow<TCustomNode, TCustomEdge>()

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
            <OnboardingContextProvider>
              <Board />
            </OnboardingContextProvider>
          </ClickCanvaProvider>
        </AppShell.Main>
      </DndContext>
    </AppShell>
  )
}
