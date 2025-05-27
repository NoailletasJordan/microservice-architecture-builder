import { ReactNode, useContext, useState } from 'react'
import { userContext } from '../User/constants'
import { userBoardsContext } from './constants'
import {
  useHandleBoardsOnLogout,
  useMutateUserBoard,
  useOnBoardsDataFirstLoad,
  useUserBoards,
} from './hooks'

interface IProps {
  children: ReactNode
}

export default function UserBoardsProvider({ children }: IProps) {
  const [currentUserBoardId, setCurrentUserBoardId] = useState<
    string | undefined
  >(undefined)
  const { isLogged } = useContext(userContext)
  const boardsQuery = useUserBoards()

  useHandleBoardsOnLogout({
    isLogged,
    resetCurrentUserBoardId: () => setCurrentUserBoardId(undefined),
  })

  useOnBoardsDataFirstLoad({
    boardsQuery,
    setCurrentUserBoardId,
  })

  const { create, remove, update } = useMutateUserBoard()

  return (
    <userBoardsContext.Provider
      value={{
        boardsQuery,
        currentUserBoardId,
        handleSetCurrentUserBoardId: (boardId: string) =>
          setCurrentUserBoardId(boardId),
        create,
        remove,
        update,
      }}
    >
      {children}
    </userBoardsContext.Provider>
  )
}
