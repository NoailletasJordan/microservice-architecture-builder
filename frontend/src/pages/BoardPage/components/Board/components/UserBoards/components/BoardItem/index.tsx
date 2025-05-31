import { TBoardModel } from '@/contexts/UserBoards/constants'
import { MutationUserBoard } from '@/contexts/UserBoards/hooks/useMutateUserBoard'
import { useQueryKey } from '@/contexts/UserBoards/hooks/useQueryKey'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Group, Title } from '@mantine/core'
import { IconEdit, IconSelect, IconTrash } from '@tabler/icons-react'
import { useMutationState } from '@tanstack/react-query'

function mutationIsRename(variable: MutationUserBoard) {
  return variable.method === 'PATCH' && !!variable.payload?.title
}

function mutationIsDelete(variable: MutationUserBoard) {
  return variable.method === 'DELETE'
}

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
  const { isRenaming, isDeleting } = useIsRenamingOrDeleting(board.id!)

  return (
    <Group bg={active ? 'gray.6' : 'gray.8'} p="xs">
      <Title order={5}>{board.title}</Title>
      <Group gap="xs">
        <ActionIcon loading={isRenaming} onClick={() => onEdit('new Title')}>
          <IconEdit style={ICON_STYLE} />
        </ActionIcon>
        <ActionIcon onClick={() => onSelect()}>
          <IconSelect style={ICON_STYLE} />
        </ActionIcon>
        <ActionIcon
          loading={isDeleting}
          onClick={onDelete}
          disabled={disableDelete}
        >
          <IconTrash style={ICON_STYLE} />
        </ActionIcon>
      </Group>
    </Group>
  )
}

function useIsRenamingOrDeleting(boardId: string) {
  const deleteOrRenamesMutation = useMutationState({
    filters: {
      mutationKey: useQueryKey(),
      status: 'pending',
      predicate: (m) => {
        const variables = m.state.variables as MutationUserBoard
        const isThisBoard = variables.boardId === boardId
        const isRename = mutationIsRename(variables)
        const isDelete = mutationIsDelete(variables)

        return isThisBoard && (isRename || isDelete)
      },
    },
    select: (m) => m.state.variables,
  }) as MutationUserBoard[]

  const isRenaming = deleteOrRenamesMutation.some(mutationIsRename)
  const isDeleting = deleteOrRenamesMutation.some(mutationIsDelete)
  return { isRenaming, isDeleting }
}
