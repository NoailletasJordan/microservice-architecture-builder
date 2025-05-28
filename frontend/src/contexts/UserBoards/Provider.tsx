import { useEffectEventP } from '@/contants'
import { useQueryClient } from '@tanstack/react-query'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { useReactFlow } from 'reactflow'
import { userContext } from '../User/constants'
import { userBoardsContext } from './constants'
import {
  handleLoadUserBoards,
  useMutateUserBoard,
  useQueryKey,
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
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()

  const nonReactiveState = useEffectEventP(() => ({
    boardsQuery,
    flowInstance,
    setCurrentUserBoardId,
    createNewBoard: mutator.create,
  }))

  // onLoginChange
  useEffect(() => {
    const { createNewBoard, boardsQuery, flowInstance, setCurrentUserBoardId } =
      nonReactiveState()

    if (!isLogged) {
      queryClient.removeQueries({ queryKey })
      queryClient.setQueryData(queryKey, undefined)
      // Reset boardId
      setCurrentUserBoardId(undefined)
      console.log('called logof')
    } else {
      boardsQuery.refetch()
      handleLoadUserBoards({
        setCurrentUserBoardId,
        boardsQuery,
        createNewBoard,
        flowInstance,
      })
    }
  }, [isLogged, nonReactiveState])

  console.log(':currentfromobj', currentUserBoardId)

  // useHandleBoardsOnLogout({
  //   isLogged,
  //   resetCurrentUserBoardId: () => setCurrentUserBoardId(undefined),
  // })

  // useOnBoardsDataFirstLoad({
  //   boardsQuery,
  //   setCurrentUserBoardId,
  // })

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
