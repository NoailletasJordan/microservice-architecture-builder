import { Menu } from '@mantine/core'
import ClearBoard from './components/ClearBoard'
import DeleteCurrentBoard from './components/DeleteBoard'
import Github from './components/Github'
import LogInLogOut from './components/LogInLogOut'
import NewBoard from './components/NewBoard'
import SelectBoard from './components/SelectBoard'

interface Props {
  openClearCurrentBoardModal: () => void
  openDeleteCurrentBoardModal: () => void
}

const disabledTooltip = 'Log in to handle multiple boards'

export default function Dropdown({
  openClearCurrentBoardModal,
  openDeleteCurrentBoardModal,
}: Props) {
  return (
    <Menu.Dropdown>
      <Menu.Label>Board actions</Menu.Label>
      <ClearBoard openClearCurrentBoardModal={openClearCurrentBoardModal} />
      <NewBoard disabledTooltip={disabledTooltip} />
      <SelectBoard disabledTooltip={disabledTooltip} />
      <DeleteCurrentBoard
        openDeleteCurrentBoardModal={openDeleteCurrentBoardModal}
        disabledTooltip={disabledTooltip}
      />
      <Menu.Divider my="xs" />
      <LogInLogOut />
      <Github />
    </Menu.Dropdown>
  )
}
