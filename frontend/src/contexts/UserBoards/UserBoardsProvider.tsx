import { ReactNode, useContext, useEffect, useState } from 'react'
import { userContext } from '../User/constants'
import { showNotificationError } from '../User/UserProvider'
import { userBoardsContext } from './constants'
import {
  useCreateBoard,
  useCreateBoardIfUserHaveNone,
  useHandleBoardsOnLogout,
  useUserBoards,
} from './hooks'

interface IProps {
  children: ReactNode
}

export default function UserBoardsProvider({ children }: IProps) {
  const [currentUserBoard, setCurrentUserBoard] = useState<string | undefined>(
    undefined,
  )
  const { isLogged } = useContext(userContext)

  useHandleBoardsOnLogout(isLogged)
  const boardsQuery = useUserBoards()

  const mutationResult = useCreateBoard()
  useCreateBoardIfUserHaveNone(boardsQuery, mutationResult)

  useEffect(() => {
    if (mutationResult.isError || mutationResult.error) {
      showNotificationError('Error creating board', mutationResult.error)
    }
  }, [mutationResult.isError, mutationResult.error])

  return (
    <userBoardsContext.Provider
      value={{
        boardsQuery,
        currentUserBoard,
        handleSetCurrentUserBoard: (boardId: string) =>
          setCurrentUserBoard(boardId),
      }}
    >
      {children}
    </userBoardsContext.Provider>
  )
}
