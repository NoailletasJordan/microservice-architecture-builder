import { ReactNode, useContext, useState } from 'react'
import { userContext } from '../User/constants'
import { userBoardsContext } from './constants'
import {
  useCreateBoardIfUserHaveNone,
  useHandleBoardsOnLogout,
  useSetCurrentUserBoardOnLogging,
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

  const boardsQuery = useUserBoards()

  useSetCurrentUserBoardOnLogging(setCurrentUserBoard)
  useHandleBoardsOnLogout({
    isLogged,
    resetCurrentUserBoard: () => setCurrentUserBoard(undefined),
  })

  useCreateBoardIfUserHaveNone(boardsQuery)

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
