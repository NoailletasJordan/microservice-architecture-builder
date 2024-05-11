import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useReactFlow } from 'reactflow'
import selectedNodeContext, {
  ISelectedNodeContext,
} from '../../selectedNodeContext'
import Dashboard from '../BoardPage/components/DashBoard'
import AsideModule from './components/AsideModule/index'
import Board from './components/Board'
import { DroppableType } from './components/Board/constants'
import { onDragEndConfig } from './components/Board/helpers'

export default function BoardPage() {
  const { id: boardId } = useParams()
  const flowInstance = useReactFlow()
  const [
    asideIsOpened,
    { open: openSelectedNodeSection, toggle: toggleAsideIsOpened },
  ] = useDisclosure(false)

  const [nodeAsideContext, setNodeAsideContext] =
    useState<ISelectedNodeContext>({
      node: null,
      setNode: (newId) => {
        setNodeAsideContext({ ...nodeAsideContext, node: newId })
      },
      openSelectedNodeSection,
    })

  // TODO loader
  if (!boardId) return <div />

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
        }}
        padding="md"
      >
        <selectedNodeContext.Provider value={nodeAsideContext}>
          <AppShell.Header>
            <div>Logo</div>
          </AppShell.Header>
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
            <AppShell.Navbar p="md">
              <Dashboard />
            </AppShell.Navbar>

            <AppShell.Main>
              <Board boardId={boardId} />
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
