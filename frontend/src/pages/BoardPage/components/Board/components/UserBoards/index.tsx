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
import { Panel } from 'reactflow'
import { ICON_STYLE } from '../../../../configs/constants'
import BoardItem from './components/BoardItem'

export default function UserBoards() {
  // const { data: boards } = useBoards()
  const boards: any = []

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
        {boards ? (
          <Stack gap="xs">
            {boards.map((board: any) => (
              <BoardItem board={board} />
            ))}
          </Stack>
        ) : (
          <Stack>
            <Text>No boards</Text>
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
