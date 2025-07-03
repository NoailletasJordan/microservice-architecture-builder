import TooltipWrapper from '@/components/TooltipWrapper'
import { userContext } from '@/contexts/User/constants'
import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Menu, Text } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useContext } from 'react'

interface Props {
  openDeleteCurrentBoardModal: () => void
  closeMenu: () => void
}

export default function DeleteBoard({
  openDeleteCurrentBoardModal,
  closeMenu,
}: Props) {
  const { isLogged } = useContext(userContext)
  const { boards } = useContext(userBoardsContext)

  const notEnoughBoardsToDelete = isLogged && boards.length < 2

  return (
    <TooltipWrapper
      position="right"
      label={notEnoughBoardsToDelete ? "Can't delete your only board " : ''}
    >
      <Menu.Item
        leftSection={<IconTrash stroke={1} style={ICON_STYLE} />}
        onClick={(e) => {
          e.stopPropagation()
          closeMenu()
          openDeleteCurrentBoardModal()
        }}
        disabled={!isLogged || notEnoughBoardsToDelete}
      >
        <Text component="span" size="sm">
          Delete
        </Text>
      </Menu.Item>
    </TooltipWrapper>
  )
}
