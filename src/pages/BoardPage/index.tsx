import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { AppShell, Burger } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useParams } from 'react-router-dom'
import { useReactFlow } from 'reactflow'
import Dashboard from '../BoardPage/components/DashBoard'
import Board from './components/Board'
import { DroppableType } from './components/Board/constants'
import { onDragEndConfig } from './components/Board/helpers'

export default function BoardPage() {
  const [opened, { toggle }] = useDisclosure()
  const { id: boardId } = useParams()
  const flowInstance = useReactFlow()

  // TODO loader
  if (!boardId) return <div />

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
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
      </AppShell>
    </>
  )
}
