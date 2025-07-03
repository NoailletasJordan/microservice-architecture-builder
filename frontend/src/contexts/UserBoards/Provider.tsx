import { ReactNode, useState } from 'react'
import { userBoardsContext } from './constants'
import { useHandleBoardsOnLoginLogout } from './hooks/useHandleBoardsOnLoginLogout'
import { useMutateUserBoard } from './hooks/useMutateUserBoard'
import { useUserBoards } from './hooks/useUserBoards'

interface IProps {
  children: ReactNode
}

export default function UserBoardsProvider({ children }: IProps) {
  const [currentUserBoardId, setCurrentUserBoardId] = useState<
    string | undefined
  >(undefined)
  const { boardsQuery, boards } = useUserBoards()

  useHandleBoardsOnLoginLogout({
    currentUserBoardId,
    setCurrentUserBoardId,
    boardsQuery,
  })

  const mutator = useMutateUserBoard({
    currentUserBoardId,
    setCurrentUserBoardId,
  })

  return (
    <userBoardsContext.Provider
      value={{
        boards,
        boardsQuery,
        currentUserBoardId,
        setCurrentUserBoardId,
        create: mutator.create,
        remove: mutator.remove,
        update: mutator.update,
      }}
    >
      {children}
    </userBoardsContext.Provider>
  )
}
