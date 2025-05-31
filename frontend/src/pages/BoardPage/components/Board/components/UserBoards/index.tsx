import { TBoardModel, userBoardsContext } from '@/contexts/UserBoards/constants'
import { MutationUserBoard } from '@/contexts/UserBoards/hooks/useMutateUserBoard'
import { useQueryKey } from '@/contexts/UserBoards/hooks/useQueryKey'
import {
  ActionIcon,
  Card,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useMutationState } from '@tanstack/react-query'
import { useContext } from 'react'
import { Panel } from 'reactflow'
import { ICON_STYLE } from '../../../../configs/constants'
import BoardItem from './components/BoardItem'

export default function UserBoards() {
  const { boardsQuery, currentUserBoardId, setCurrentUserBoardId } =
    useContext(userBoardsContext)

  const { create } = useContext(userBoardsContext)

  const isCreatingBoard = useMutationState({
    filters: {
      mutationKey: useQueryKey(),
      status: 'pending',
      predicate: (m) => {
        const variables = m.state.variables as MutationUserBoard
        return variables.method === 'POST'
      },
    },
    select: (m) => m.state.variables,
  }) as MutationUserBoard[]

  let component = null
  if (boardsQuery?.isError) component = null
  else if (boardsQuery?.isLoading) component = <LoadingStateComponent />
  else if (boardsQuery?.data)
    component = (
      <BoardList boards={boardsQuery.data as Partial<TBoardModel>[]} />
    )

  return (
    <Panel position="bottom-left">
      <Card bg="gray.9">
        <Group justify="space-between">
          <Text>Boards</Text>
          <Text>{currentUserBoardId}</Text>
          <ActionIcon
            loading={isCreatingBoard.length > 0}
            onClick={() => {
              create({
                title: 'My added board',
                nodes: [],
                edges: [],
              })
            }}
          >
            <IconPlus style={ICON_STYLE} />
          </ActionIcon>
        </Group>

        <Divider my="sm" />
        {component}
      </Card>
    </Panel>
  )
}

function BoardList({ boards }: { boards: Partial<TBoardModel>[] }) {
  const { update, remove, currentUserBoardId, setCurrentUserBoardId } =
    useContext(userBoardsContext)

  return (
    <Stack gap="xs">
      {boards.map((board: any) => (
        <BoardItem
          onSelect={() => {
            setCurrentUserBoardId(board.id)
          }}
          key={board.id}
          active={board.id === currentUserBoardId}
          board={board}
          disableDelete={boards.length === 1}
          onDelete={() => {
            remove(board.id)
          }}
          onEdit={(value: string) => {
            update({
              boardId: board.id,
              payload: { title: value },
            })
          }}
        />
      ))}
    </Stack>
  )
}

function LoadingStateComponent() {
  return (
    <Stack>
      <Skeleton height={50} width={100} />
    </Stack>
  )
}
