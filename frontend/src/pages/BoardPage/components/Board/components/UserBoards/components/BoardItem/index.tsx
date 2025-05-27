import { TBoardModel } from '@/contexts/UserBoards/constants'
import { useMutateBoards } from '@/contexts/UserBoards/hooks'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Group, Title } from '@mantine/core'
import { IconEdit, IconSelect, IconTrash } from '@tabler/icons-react'

export default function BoardItem({
  board,
  active,
  onSelect,
}: {
  active: boolean
  onSelect: () => void
  board: Partial<TBoardModel>
}) {
  const mutateBoards = useMutateBoards()

  return (
    <Group bg={active ? 'gray.6' : 'gray.8'} p="xs">
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
        <ActionIcon onClick={() => onSelect()}>
          <IconSelect style={ICON_STYLE} />
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
