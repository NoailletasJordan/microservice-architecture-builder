import { userContext } from '@/contexts/User/constants'
import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { useContext } from 'react'

export function IsEnabled() {
  const { isLogged } = useContext(userContext)
  const { boardsQuery, currentUserBoardId } = useContext(userBoardsContext)

  return (
    isLogged &&
    boardsQuery.isFetched &&
    boardsQuery.isSuccess &&
    !!currentUserBoardId
  )
}
