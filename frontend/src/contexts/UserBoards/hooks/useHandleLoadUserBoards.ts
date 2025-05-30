import { showNotificationSuccess, useEffectEventP } from '@/contants'
import { userContext } from '@/contexts/User/constants'
import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useContext, useEffect } from 'react'
import { ReactFlowInstance, useReactFlow } from 'reactflow'
import { TBoardModel } from '../constants'
import { useMutateUserBoard } from './useMutateUserBoard'
import { useUserBoards } from './useUserBoards'

export function useHandleLoadUserBoards({
  boardsQuery,
  currentUserBoardId,
  setCurrentUserBoardId,
}: {
  currentUserBoardId: string | undefined
  setCurrentUserBoardId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
  boardsQuery: ReturnType<typeof useUserBoards>
}) {
  const { isLogged } = useContext(userContext)
  const flowInstance = useReactFlow()

  const mutator = useMutateUserBoard({
    currentUserBoardId,
    setCurrentUserBoardId,
  })

  const nonReactiveState = useEffectEventP(() => ({
    refetch: boardsQuery.refetch,
    flowInstance,
    setCurrentUserBoardId,
    createNewBoard: mutator.create,
  }))

  useEffect(() => {
    const { createNewBoard, flowInstance, setCurrentUserBoardId, refetch } =
      nonReactiveState()

    if (isLogged) {
      handleLoadUserBoards({
        setCurrentUserBoardId,
        refetch,
        createNewBoard,
        flowInstance,
      })
    }
  }, [isLogged, nonReactiveState])
}

export async function handleLoadUserBoards({
  setCurrentUserBoardId,
  refetch,
  flowInstance,
  createNewBoard,
}: {
  setCurrentUserBoardId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
  refetch: ReturnType<typeof useUserBoards>['refetch']
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
  const { data, isSuccess } = await refetch()
  if (!isSuccess || 'error' in data) return
  const hadCurrentDataBoard = flowInstance.getNodes().length > 0

  // if user Has board data, create new userboard and load it
  if (hadCurrentDataBoard) {
    const data = await createNewBoard({
      title: `Pushed-on ${new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date())}`,
      nodes: flowInstance.getNodes(),
      edges: flowInstance.getEdges(),
    })
    setCurrentUserBoardId(data.id)
    showNotificationSuccess({
      title: 'Connected to the cloud',
      message: 'I pushed your existing work into a new board :)',
    })
    return
  }

  const userBoards = data as TBoardModel[]
  if (userBoards.length === 0) {
    // If user has no boards, create a new one and load it
    const data = await createNewBoard({
      title: 'New board',
      nodes: flowInstance.getNodes(),
      edges: flowInstance.getEdges(),
    })
    setCurrentUserBoardId(data.id)
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
