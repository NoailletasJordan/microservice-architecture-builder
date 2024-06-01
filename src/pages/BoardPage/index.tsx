import ConnexionContextProvider from '@/contexts/Connexion/ConnexionProvider'
import SelectedNodeProvider from '@/contexts/SelectedNode/SelectedNodeProvider'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { AppShell } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { useReactFlow } from 'reactflow'
import AsideModule from './components/AsideModule/index'
import Board from './components/Board'
import { DroppableType } from './components/Board/constants'
import { onDragEndConfig } from './dragHandlers'

export default function BoardPage() {
  const { id: boardId } = useParams()
  const flowInstance = useReactFlow()

  // TODO loader
  if (!boardId) return <div />

  return (
    <>
      <AppShell>
        <ConnexionContextProvider>
          <SelectedNodeProvider>
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
                <Board boardId={boardId} />
              </AppShell.Main>
            </DndContext>
            <AppShell.Aside>
              <AsideModule />
            </AppShell.Aside>
          </SelectedNodeProvider>
        </ConnexionContextProvider>
      </AppShell>
    </>
  )
}
