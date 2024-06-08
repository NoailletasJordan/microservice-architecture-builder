import ConnexionContextProvider from '@/contexts/Connexion/ConnexionProvider'
import SelectedNodeProvider from '@/contexts/SelectedNode/SelectedNodeProvider'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { AppShell } from '@mantine/core'
import { useReactFlow } from 'reactflow'
import AsideModule from './components/AsideModule/index'
import Board from './components/Board'
import ModalLoadShareableLink from './components/Board/components/LoadExternalBoardHandler'
import { DroppableType } from './configs/constants'
import { onDragEndConfig } from './configs/drag-handlers'

export default function BoardPage() {
  const flowInstance = useReactFlow()

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
                <Board />
                <ModalLoadShareableLink />
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
