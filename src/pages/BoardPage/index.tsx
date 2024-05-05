import { AppShell, Burger } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useParams } from 'react-router-dom'
import { ReactFlowProvider } from 'reactflow'
import Dashboard from '../BoardPage/components/DashBoard'
import Board from './components/Board'

export default function BoardPage() {
  const [opened, { toggle }] = useDisclosure()
  const { id: boardId } = useParams()

  // TODO loader
  if (!boardId) return <div />

  return (
    <ReactFlowProvider>
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

        <AppShell.Navbar p="md">
          <Dashboard />
        </AppShell.Navbar>

        <AppShell.Main>
          <Board boardId={boardId} />
        </AppShell.Main>
      </AppShell>
    </ReactFlowProvider>
  )
}
