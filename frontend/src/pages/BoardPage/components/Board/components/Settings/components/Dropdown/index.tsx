import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Menu } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import Github from './components/Github'
import LogIn from './components/LogIn'
import ResetBoard from './components/ResetBoard'
import SwitchDropHints from './components/SwitchDropHints'

interface Props {
  openResetModal: () => void
}

export default function Dropdown({ openResetModal }: Props) {
  return (
    <Menu.Dropdown>
      <Menu.Label>Board</Menu.Label>
      <AddBoard />
      <DuplicateBoard />
      <ResetBoard openResetModal={openResetModal} />
      <Menu.Divider my="xs" />
      <Menu.Label>Settings</Menu.Label>
      <Github />
      <LogIn />
      <Menu.Divider my="xs" />
      <Menu.Label>Settings</Menu.Label>
      <SwitchDropHints />
    </Menu.Dropdown>
  )
}
function AddBoard() {
  return (
    <Menu.Item leftSection={<IconPlus stroke={1} style={ICON_STYLE} />}>
      New board
    </Menu.Item>
  )
}

function DuplicateBoard() {
  /** Temp */
  console.log('Menu.Sub:', Menu)
  return (
    <Menu.Sub>
      <Menu.Sub.Target>
        <Menu.Sub.Item>Products</Menu.Sub.Item>
      </Menu.Sub.Target>

      <Menu.Sub.Dropdown>
        <Menu.Item>All products</Menu.Item>
        <Menu.Item>Categories</Menu.Item>
        <Menu.Item>Tags</Menu.Item>
        <Menu.Item>Attributes</Menu.Item>
        <Menu.Item>Shipping classes</Menu.Item>
      </Menu.Sub.Dropdown>
    </Menu.Sub>
  )
}
