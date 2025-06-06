import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { MutationUserBoard } from '@/contexts/UserBoards/hooks/useMutateUserBoard'
import { useQueryKey } from '@/contexts/UserBoards/hooks/useQueryKey'
import { useMutationState } from '@tanstack/react-query'
import { useContext } from 'react'

export function useIsDeleting_() {
  const { currentUserBoardId } = useContext(userBoardsContext)
  const UserBoardsQueryKey = useQueryKey()
  const variables = useMutationState({
    filters: {
      mutationKey: UserBoardsQueryKey,
      status: 'pending',
      predicate: (mutation) => {
        const variables = mutation.state.variables as MutationUserBoard
        return (
          variables.method === 'DELETE' &&
          variables.boardId === currentUserBoardId
        )
      },
    },
    select: (mutation) => mutation.state.variables,
  }) as MutationUserBoard[]

  const isDeleting = variables.length > 0

  return isDeleting
}
