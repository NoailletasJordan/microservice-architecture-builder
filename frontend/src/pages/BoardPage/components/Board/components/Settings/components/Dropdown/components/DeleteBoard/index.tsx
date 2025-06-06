import TooltipWrapper from '@/components/TooltipWrapper'
import { userContext } from '@/contexts/User/constants'
import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Menu, Text } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useContext } from 'react'

interface Props {
  openDeleteCurrentBoardModal: () => void
  disabledTooltip?: string
}

export default function DeleteBoard({
  openDeleteCurrentBoardModal,
  disabledTooltip,
}: Props) {
  const { isLogged } = useContext(userContext)
  const { boards } = useContext(userBoardsContext)

  const notEnoughBoardsToDelete = isLogged && boards.length < 2

  if (notEnoughBoardsToDelete) {
    disabledTooltip = "Can't delete your only board "
  }
  return (
    <Menu.Item
      leftSection={<IconTrash stroke={1} style={ICON_STYLE} />}
      onClick={openDeleteCurrentBoardModal}
      disabled={!isLogged || notEnoughBoardsToDelete}
    >
      <TooltipWrapper
        position="right"
        label={disabledTooltip}
        disabled={!isLogged || !notEnoughBoardsToDelete}
      >
        <Text component="span" size="sm">
          Delete
        </Text>
      </TooltipWrapper>
    </Menu.Item>
  )
}
