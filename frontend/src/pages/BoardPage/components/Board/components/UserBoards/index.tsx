import { TBoardModel } from '@/contexts/User/constants'
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
import { useQuery } from '@tanstack/react-query'
import { Panel } from 'reactflow'
import { ICON_STYLE } from '../../../../configs/constants'
import BoardItem from './components/BoardItem'

type Props = {
  authToken: string
}

export default function UserBoards({ authToken }: Props) {
  const { data, isPending, error } = useQuery({
    queryKey: ['boards', authToken],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/board`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((res) => res.json()),
  })

  // temp
  console.log({ data })

  const boards: TBoardModel[] = [
    {
      id: '1',
      title: 'Board 1',
      owner: '1',
      data: '{}',
    },
    {
      id: '2',
      title: 'Board 2',
      owner: '1',
      data: '{}',
    },
    {
      id: '3',
      title: 'Board 3',
      owner: '1',
      data: '{}',
    },
  ]

  return (
    <Panel position="bottom-left">
      <Card bg="gray.9">
        <Group justify="space-between">
          <Text>Boards</Text>
          <ActionIcon>
            <IconPlus style={ICON_STYLE} />
          </ActionIcon>
        </Group>

        <Divider my="sm" />
        {error ? (
          <ErrorStateComponent />
        ) : isPending ? (
          <LoadingStateComponent />
        ) : (
          <Stack gap="xs">
            {boards.map((board) => (
              <BoardItem board={board} />
            ))}
          </Stack>
        )}
      </Card>
    </Panel>
  )
}

function LoadingStateComponent() {
  return (
    <Stack>
      <Skeleton height={50} width={100} />
    </Stack>
  )
}

function ErrorStateComponent() {
  return (
    <Stack>
      <Text>Error</Text>
    </Stack>
  )
}
