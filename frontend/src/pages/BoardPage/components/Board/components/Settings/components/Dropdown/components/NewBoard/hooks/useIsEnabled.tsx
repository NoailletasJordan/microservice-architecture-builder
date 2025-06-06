import { userContext } from '@/contexts/User/constants'
import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { useContext } from 'react'

export function IsEnabled() {
  const { isLogged } = useContext(userContext)
  const { boardsQuery, currentUserBoardId } = useContext(userBoardsContext)

  /** Temp */
  console.log('isSuccess:', boardsQuery.isSuccess)
  console.log('isFetched:', boardsQuery.isFetched)
  console.log('currentUserBoardId:', currentUserBoardId)
  return (
    isLogged &&
    boardsQuery.isFetched &&
    boardsQuery.isSuccess &&
    !!currentUserBoardId
  )
}
