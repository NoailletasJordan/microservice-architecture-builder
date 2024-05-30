import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useReactFlow } from 'reactflow'
import selectedNodeContext, {
  ISelectedNodeContext,
} from '../../selectedNodeContext'
import AsideModule from './components/AsideModule/index'
import Board from './components/Board'
import { DroppableType } from './components/Board/constants'
import { onDragEndConfig } from './dragHandlers'

export default function BoardPage() {
  const { id: boardId } = useParams()
  const flowInstance = useReactFlow()
  const [
    asideIsOpened,
    { open: openSelectedNodeSection, toggle: toggleAsideIsOpened },
  ] = useDisclosure(false)

  const [nodeAsideContext, setNodeAsideContext] =
    useState<ISelectedNodeContext>({
      serviceId: null,
      setServiceId: (newId) => {
        setNodeAsideContext((context) => ({ ...context, serviceId: newId }))
      },
      openSelectedNodeSection,
    })

  // TODO loader
  if (!boardId) return <div />

  return (
    <>
      <AppShell>
        <selectedNodeContext.Provider value={nodeAsideContext}>
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
              <Board
                boardId={boardId}
                toggleAsideIsOpened={toggleAsideIsOpened}
              />
            </AppShell.Main>
          </DndContext>
          <AppShell.Aside>
            <AsideModule
              asideIsOpened={asideIsOpened}
              toggleAsideIsOpened={toggleAsideIsOpened}
            />
          </AppShell.Aside>
        </selectedNodeContext.Provider>
      </AppShell>
    </>
  )
}
