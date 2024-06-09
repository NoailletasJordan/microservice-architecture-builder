import { ActionIcon, Divider, Menu } from '@mantine/core'
import { IconMenu2 } from '@tabler/icons-react'
import { Panel } from 'reactflow'
import ResetBoard from './components/ResetBoard'
import SwitchDropHints from './components/SwitchDropHints'

interface Props {
  openResetModal: () => void
}

export default function Settings({ openResetModal }: Props) {
  const target = (
    <Menu.Target>
      <ActionIcon size="lg" variant="light">
        <IconMenu2 style={{ width: '50%', height: '50%' }} />
      </ActionIcon>
    </Menu.Target>
  )

  return (
    <Panel position="top-left">
      <Menu shadow="md">
        {target}
        <Menu.Dropdown>
          <ResetBoard openResetModal={openResetModal} />

          <Divider my="xs" />
          <SwitchDropHints />
        </Menu.Dropdown>
      </Menu>
    </Panel>
  )
}
