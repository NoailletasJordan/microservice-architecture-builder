import TooltipWrapper from '@/components/TooltipWrapper'
import { userContext } from '@/contexts/User/constants'
import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Menu } from '@mantine/core'
import { IconCaretUpDown } from '@tabler/icons-react'
import { useContext } from 'react'

interface Props {
  disabledTooltip?: string
}

export default function SelectBoard({ disabledTooltip }: Props) {
  const { boards, currentUserBoardId, setCurrentUserBoardId } =
    useContext(userBoardsContext)

  const { isLogged } = useContext(userContext)

  return (
    <Menu.Sub>
      <Menu.Sub.Target>
        <Menu.Sub.Item
          leftSection={<IconCaretUpDown stroke={1} style={ICON_STYLE} />}
          disabled={!isLogged}
        >
          <TooltipWrapper
            disabled={isLogged}
            position="right"
            label={disabledTooltip}
          >
            Load
          </TooltipWrapper>
        </Menu.Sub.Item>
      </Menu.Sub.Target>

      <Menu.Sub.Dropdown>
        {boards.map((board) => (
          <Menu.Item
            onClick={() => setCurrentUserBoardId(board.id)}
            key={board.id}
            disabled={board.id === currentUserBoardId}
          >
            {board.title}
          </Menu.Item>
        ))}
      </Menu.Sub.Dropdown>
    </Menu.Sub>
  )
}
