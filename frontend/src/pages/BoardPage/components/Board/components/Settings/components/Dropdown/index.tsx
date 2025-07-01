import TooltipWrapper from '@/components/TooltipWrapper'
import { userContext } from '@/contexts/User/constants'
import { Badge, Card, Center, Menu } from '@mantine/core'
import { ReactNode, useContext } from 'react'
import ClearBoard from './components/ClearBoard'
import DeleteCurrentBoard from './components/DeleteBoard'
import Github from './components/Github'
import LoadBoard from './components/LoadBoard'
import LogInLogOut from './components/LogInLogOut'
import NewBoard from './components/NewBoard'

interface Props {
  openClearCurrentBoardModal: () => void
  openDeleteCurrentBoardModal: () => void
  closeMenu: () => void
}

const disabledTooltip = 'Log in to work with multiple boards'

export default function Dropdown({
  openClearCurrentBoardModal,
  openDeleteCurrentBoardModal,
  closeMenu,
}: Props) {
  const { isLogged } = useContext(userContext)
  return (
    <Menu.Dropdown>
      <Menu.Label>Board actions</Menu.Label>
      <ClearBoard
        openClearCurrentBoardModal={openClearCurrentBoardModal}
        closeMenu={closeMenu}
      />
      {isLogged ? (
        <ProtectedItems
          openDeleteCurrentBoardModal={openDeleteCurrentBoardModal}
          closeMenu={closeMenu}
        />
      ) : (
        <LockItemsWrapper>
          <ProtectedItems
            openDeleteCurrentBoardModal={openDeleteCurrentBoardModal}
            closeMenu={closeMenu}
          />
        </LockItemsWrapper>
      )}
      <Menu.Divider my="xs" />
      <LogInLogOut closeMenu={closeMenu} />
      <Github closeMenu={closeMenu} />
    </Menu.Dropdown>
  )
}

function ProtectedItems({
  openDeleteCurrentBoardModal,
  closeMenu,
}: {
  openDeleteCurrentBoardModal: () => void
  closeMenu: () => void
}) {
  return (
    <>
      <NewBoard closeMenu={closeMenu} />
      <LoadBoard closeMenu={closeMenu} />
      <DeleteCurrentBoard
        openDeleteCurrentBoardModal={openDeleteCurrentBoardModal}
        closeMenu={closeMenu}
      />
    </>
  )
}

function LockItemsWrapper({ children }: { children: ReactNode }) {
  return (
    <TooltipWrapper position="right" label={disabledTooltip}>
      <Card radius="md" px="xs" bg="#11111188">
        {children}
        <Center mt="xs">
          <Badge size="xs" color="gray">
            Log in required
          </Badge>
        </Center>
      </Card>
    </TooltipWrapper>
  )
}
