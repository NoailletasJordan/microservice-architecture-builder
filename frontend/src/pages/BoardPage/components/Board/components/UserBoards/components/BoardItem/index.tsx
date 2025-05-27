import { TBoardModel } from '@/contexts/UserBoards/constants'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Group, Title } from '@mantine/core'
import { IconEdit, IconSelect, IconTrash } from '@tabler/icons-react'

export default function BoardItem({
  board,
  active,
  onSelect,
  onDelete,
  onEdit,
  disableDelete,
}: {
  active: boolean
  onSelect: () => void
  board: Partial<TBoardModel>
  onDelete: () => void
  disableDelete?: boolean
  onEdit: (value: string) => void
}) {
  return (
    <Group bg={active ? 'gray.6' : 'gray.8'} p="xs">
      <Title order={5}>{board.title}</Title>
      <Group gap="xs">
        <ActionIcon onClick={() => onEdit('new Title')}>
          <IconEdit style={ICON_STYLE} />
        </ActionIcon>
        <ActionIcon onClick={() => onSelect()}>
          <IconSelect style={ICON_STYLE} />
        </ActionIcon>
        <ActionIcon onClick={onDelete} disabled={disableDelete}>
          <IconTrash style={ICON_STYLE} />
        </ActionIcon>
      </Group>
    </Group>
  )
}
