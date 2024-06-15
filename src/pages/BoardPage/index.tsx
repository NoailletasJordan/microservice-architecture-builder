import ConnexionContextProvider from '@/contexts/Connexion/ConnexionProvider'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { AppShell } from '@mantine/core'
import { useReactFlow } from 'reactflow'
import Board from './components/Board'
import { DroppableType } from './configs/constants'
import { onDragEndConfig } from './configs/drag-handlers'

export default function BoardPage() {
  const flowInstance = useReactFlow()

  return (
    <AppShell>
      <ConnexionContextProvider>
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
            <Board />
          </AppShell.Main>
        </DndContext>
      </ConnexionContextProvider>
    </AppShell>
  )
}
