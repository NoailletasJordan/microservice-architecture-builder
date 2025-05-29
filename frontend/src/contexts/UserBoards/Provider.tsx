import { useEffectEventP } from '@/contants'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { useReactFlow } from 'reactflow'
import { userContext } from '../User/constants'
import { userBoardsContext } from './constants'
import {
  handleLoadUserBoards,
  useHandleBoardsOnLogout,
  useMutateUserBoard,
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

  const mutator = useMutateUserBoard({
    currentUserBoardId,
    setCurrentUserBoardId,
  })
  const flowInstance = useReactFlow()

  const nonReactiveState = useEffectEventP(() => ({
    flowInstance,
    setCurrentUserBoardId,
    createNewBoard: mutator.create,
  }))

  useHandleBoardsOnLogout({
    resetCurrentUserBoardId: () => setCurrentUserBoardId(undefined),
  })

  // on Login
  useEffect(() => {
    const { createNewBoard, flowInstance, setCurrentUserBoardId } =
      nonReactiveState()

    if (isLogged) {
      handleLoadUserBoards({
        setCurrentUserBoardId,
        boardsQuery,
        createNewBoard,
        flowInstance,
      })
    }
  }, [isLogged, nonReactiveState])

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
