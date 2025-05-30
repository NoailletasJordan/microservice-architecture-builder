import { showNotificationSuccess, useEffectEventP } from '@/contants'
import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useEffect, useMemo, useRef } from 'react'
import { ReactFlowInstance, useReactFlow } from 'reactflow'
import { TBoardModel } from '../constants'
import { useMutateUserBoard } from './useMutateUserBoard'
import { useUserBoards } from './useUserBoards'

export function useHandleBoardsOnLoginLogout({
  currentUserBoardId,
  setCurrentUserBoardId,
}: {
  currentUserBoardId: string | undefined
  setCurrentUserBoardId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
}) {
  const boardsQuery = useUserBoards()
  const hasBoards = useMemo(() => {
    return (
      boardsQuery.data &&
      !('error' in boardsQuery.data) &&
      boardsQuery.data.length > 0
    )
  }, [boardsQuery.data])

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

  const previouslyHadBoard = useRef(false)
  useEffect(() => {
    const { setCurrentUserBoardId, flowInstance, createNewBoard, boardsQuery } =
      nonReactiveState()
    if (
      boardsQuery.isError ||
      (boardsQuery.data && 'error' in boardsQuery.data)
    )
      return

    if (!hasBoards) {
      if (previouslyHadBoard.current) {
        // User logged out
        previouslyHadBoard.current = false
        setCurrentUserBoardId(undefined)
        showNotificationSuccess({
          title: "You're logged out",
          message: 'I will now save your work on your browser',
        })
      }
    } else {
      // User logged in
      previouslyHadBoard.current = true
      const userBoards = boardsQuery.data as TBoardModel[]
      handleLoadRemoteUserBoards({
        setCurrentUserBoardId,
        userBoards,
        createNewBoard,
        flowInstance,
      })
    }
  }, [hasBoards, nonReactiveState])
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
      message: 'I pushed your existing work into a new board :)',
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
    showNotificationSuccess({
      title: 'Welcome back',
    })
  }
}
