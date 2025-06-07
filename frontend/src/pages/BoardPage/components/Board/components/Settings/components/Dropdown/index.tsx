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
}

const disabledTooltip = 'Save on the cloud and work with multiple boards'

export default function Dropdown({
  openClearCurrentBoardModal,
  openDeleteCurrentBoardModal,
}: Props) {
  const { isLogged } = useContext(userContext)
  return (
    <Menu.Dropdown>
      <Menu.Label>Board actions</Menu.Label>
      <ClearBoard openClearCurrentBoardModal={openClearCurrentBoardModal} />
      {isLogged ? (
        <ProtectedItems
          openDeleteCurrentBoardModal={openDeleteCurrentBoardModal}
        />
      ) : (
        <LockItemsWrapper>
          <ProtectedItems
            openDeleteCurrentBoardModal={openDeleteCurrentBoardModal}
          />
        </LockItemsWrapper>
      )}
      <Menu.Divider my="xs" />
      <LogInLogOut />
      <Github />
    </Menu.Dropdown>
  )
}

function ProtectedItems({
  openDeleteCurrentBoardModal,
}: {
  openDeleteCurrentBoardModal: () => void
}) {
  return (
    <>
      <NewBoard />
      <LoadBoard />
      <DeleteCurrentBoard
        openDeleteCurrentBoardModal={openDeleteCurrentBoardModal}
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
