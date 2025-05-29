import { ReactNode, useState } from 'react'
import { userBoardsContext } from './constants'
import { useHandleBoardsOnLogout } from './hooks/useHandleBoardsOnLogout'
import { useHandleLoadUserBoards } from './hooks/useHandleLoadUserBoards'
import { useMutateUserBoard } from './hooks/useMutateUserBoard'
import { useUserBoards } from './hooks/useUserBoards'

interface IProps {
  children: ReactNode
}

export default function UserBoardsProvider({ children }: IProps) {
  const [currentUserBoardId, setCurrentUserBoardId] = useState<
    string | undefined
  >(undefined)
  const boardsQuery = useUserBoards()

  const mutator = useMutateUserBoard({
    currentUserBoardId,
    setCurrentUserBoardId,
  })

  useHandleBoardsOnLogout({
    resetCurrentUserBoardId: () => setCurrentUserBoardId(undefined),
  })

  useHandleLoadUserBoards({
    currentUserBoardId,
    setCurrentUserBoardId,
    boardsQuery,
  })

  return (
    <userBoardsContext.Provider
      value={{
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
