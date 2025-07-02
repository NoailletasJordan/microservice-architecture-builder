import { USER_MAX_BOARD_AMOUNT } from '@/contants'
import { userContext } from '@/contexts/User/constants'
import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { useContext } from 'react'

export function useIsEnabledConfig() {
  const { isLogged } = useContext(userContext)
  const { boardsQuery, currentUserBoardId } = useContext(userBoardsContext)

  const { boards } = useContext(userBoardsContext)

  const maxBoardsReached = boards.length >= USER_MAX_BOARD_AMOUNT

  return {
    disableMessage: maxBoardsReached
      ? `Maximum of ${USER_MAX_BOARD_AMOUNT} boards reached`
      : '',
    isEnabled:
      isLogged &&
      boardsQuery.isFetched &&
      boardsQuery.isSuccess &&
      !!currentUserBoardId &&
      !maxBoardsReached,
  }
}
