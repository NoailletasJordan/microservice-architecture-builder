import { useEffectEventP } from '@/contants'
import { userContext } from '@/contexts/User/constants'
import { showNotificationSuccess } from '@/helpers-react'
import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { UseQueryResult } from '@tanstack/react-query'
import { useContext, useEffect, useRef } from 'react'
import { ReactFlowInstance, useReactFlow } from 'reactflow'
import { TBoardModel } from '../constants'
import { useMutateUserBoard } from './useMutateUserBoard'

export function useHandleBoardsOnLoginLogout({
  currentUserBoardId,
  setCurrentUserBoardId,
  boardsQuery,
}: {
  currentUserBoardId: string | undefined
  setCurrentUserBoardId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
  boardsQuery: UseQueryResult<TBoardModel[], Error>
}) {
  const { isLogged } = useContext(userContext)

  const mutator = useMutateUserBoard({
    currentUserBoardId,
    setCurrentUserBoardId,
  })

  const flowInstance = useReactFlow()
  const nonReactiveState = useEffectEventP(() => ({
    createNewBoard: mutator.create,
    boardsQuery,
    flowInstance,
    setCurrentUserBoardId,
  }))

  const usedPreviouslyLoggedIn = useRef(false)
  useEffect(() => {
    const { setCurrentUserBoardId, flowInstance, createNewBoard, boardsQuery } =
      nonReactiveState()
    if (
      !boardsQuery.isFetched ||
      boardsQuery.isError ||
      (boardsQuery.data && 'error' in boardsQuery.data)
    )
      return

    if (!isLogged) {
      if (usedPreviouslyLoggedIn.current) {
        // User logging out
        usedPreviouslyLoggedIn.current = false
        setCurrentUserBoardId(undefined)
        showNotificationSuccess({
          title: "You're logged out",
          message: 'Your work will be waiting for your return',
        })
      }
    } else {
      // User logged in
      usedPreviouslyLoggedIn.current = true
      const userBoards = boardsQuery.data as TBoardModel[]
      handleLoadRemoteUserBoards({
        setCurrentUserBoardId,
        userBoards,
        createNewBoard,
        flowInstance,
      })
    }
  }, [isLogged, boardsQuery.isFetched, nonReactiveState])
}

async function handleLoadRemoteUserBoards({
  setCurrentUserBoardId,
  flowInstance,
  createNewBoard,
  userBoards,
}: {
  userBoards: TBoardModel[]
  setCurrentUserBoardId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
  flowInstance: ReactFlowInstance
  createNewBoard: ({
    title,
    nodes,
    edges,
  }: {
    title: string
    nodes: TCustomNode[]
    edges: TCustomEdge[]
  }) => Promise<any>
}) {
  const hadCurrentBoardData = flowInstance.getNodes().length > 0

  // if user Has board data, create new userboard and load it
  if (hadCurrentBoardData) {
    const newBoard = await createNewBoard({
      title: `Pushed-on ${new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date())}`,
      nodes: flowInstance.getNodes(),
      edges: flowInstance.getEdges(),
    })
    setCurrentUserBoardId(newBoard.id)
    showNotificationSuccess({
      title: 'Connected to the cloud',
      message: 'I created a new board for your active work :)',
    })
    return
  }

  if (userBoards.length === 0) {
    // If user has no boards, create a new one and load it
    const newBoard = await createNewBoard({
      title: 'New board',
      nodes: flowInstance.getNodes(),
      edges: flowInstance.getEdges(),
    })
    setCurrentUserBoardId(newBoard.id)
    showNotificationSuccess({
      title: "You're in !",
      message: 'Your work will now safely be stored in the cloud :)',
    })
  } else {
    // If user has boards, load the first one
    setCurrentUserBoardId(userBoards[0].id)
  }
}
