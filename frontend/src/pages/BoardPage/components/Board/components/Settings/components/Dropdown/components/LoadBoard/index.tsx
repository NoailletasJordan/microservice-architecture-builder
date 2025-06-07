import { userContext } from '@/contexts/User/constants'
import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Badge, Menu } from '@mantine/core'
import { IconPinEnd } from '@tabler/icons-react'
import { useContext } from 'react'

export default function LoadBoard() {
  const { boards, currentUserBoardId, setCurrentUserBoardId } =
    useContext(userBoardsContext)

  const { isLogged } = useContext(userContext)

  return (
    <Menu.Sub>
      <Menu.Sub.Target>
        <Menu.Sub.Item
          leftSection={<IconPinEnd stroke={1} style={ICON_STYLE} />}
          disabled={!isLogged}
        >
          Load
        </Menu.Sub.Item>
      </Menu.Sub.Target>

      <Menu.Sub.Dropdown>
        {boards.map((board) => {
          const isCurrent = board.id === currentUserBoardId
          return (
            <Menu.Item
              onClick={() => setCurrentUserBoardId(board.id)}
              key={board.id}
              disabled={isCurrent}
              rightSection={
                isCurrent ? (
                  <Badge size="xs" color="gray">
                    Current
                  </Badge>
                ) : null
              }
            >
              {board.title}
            </Menu.Item>
          )
        })}
      </Menu.Sub.Dropdown>
    </Menu.Sub>
  )
}
