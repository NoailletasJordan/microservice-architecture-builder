import { TBoardModel } from '@/contexts/UserBoards/constants'
import { useMutateBoards } from '@/contexts/UserBoards/hooks'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Group, Title } from '@mantine/core'
import { IconEdit, IconTrash } from '@tabler/icons-react'

export default function BoardItem({ board }: { board: Partial<TBoardModel> }) {
  const mutateBoards = useMutateBoards()

  return (
    <Group bg="gray.8" p="xs">
      <Title order={5}>{board.title}</Title>
      <Group gap="xs">
        <ActionIcon
          onClick={() =>
            mutateBoards.mutate({
              payload: { title: 'new Title' },
              method: 'PATCH',
              boardId: board.id,
            })
          }
        >
          <IconEdit style={ICON_STYLE} />
        </ActionIcon>
        <ActionIcon
          onClick={() =>
            mutateBoards.mutate({
              method: 'DELETE',
              boardId: board.id,
            })
          }
        >
          <IconTrash style={ICON_STYLE} />
        </ActionIcon>
      </Group>
    </Group>
  )
}
