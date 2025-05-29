import { useEffectEventP } from '@/contants'
import { AUTH_TOKEN_KEY } from '@/contexts/User/constants'
import { TBoardModel, userBoardsContext } from '@/contexts/UserBoards/constants'
import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import {
  STORAGE_DATA_INDEX_KEY,
  TCustomNode,
} from '@/pages/BoardPage/configs/constants'
import { readLocalStorageValue } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { useContext, useEffect } from 'react'
import { useReactFlow } from 'reactflow'

export function useHandleSwitchBoardData({
  setNodes,
  setEdges,
}: {
  setNodes: React.Dispatch<React.SetStateAction<TCustomNode[]>>
  setEdges: React.Dispatch<React.SetStateAction<TCustomEdge[]>>
}) {
  const FIT_VIEW_DURATION = 700
  let { fitView } = useReactFlow()
  const { currentUserBoardId } = useContext(userBoardsContext)

  const { isSuccess, isLoading, refetch } = useQuery({
    enabled: false,
    queryKey: ['board', currentUserBoardId],
    queryFn: async () => {
      // If no board id (including not logged), load local data
      if (!currentUserBoardId) {
        const localData = readLocalStorageValue({
          key: STORAGE_DATA_INDEX_KEY,
          defaultValue: { timestamp: new Date(), nodes: [], edges: [] },
        })

        setNodes(localData.nodes)
        setEdges(localData.edges)
        setTimeout(() => fitView({ duration: FIT_VIEW_DURATION }), 100)
      } else {
        // If logged, load remote data
        const authToken = readLocalStorageValue({ key: AUTH_TOKEN_KEY })
        if (!authToken) {
          throw new Error('Authentication required')
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/board/${currentUserBoardId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          },
        )
        if (!res.ok) {
          throw new Error('Failed to fetch specific board')
        }

        const response: TBoardModel = await res.json()

        // apply remote board and remove local storage
        const { nodes, edges } = JSON.parse(response.data)
        setNodes(nodes)
        setEdges(edges)
        localStorage.removeItem(STORAGE_DATA_INDEX_KEY)
        setTimeout(() => fitView({ duration: FIT_VIEW_DURATION }), 100)
      }
      return null
    },
    staleTime: Infinity,
  })

  const nonReactiveState = useEffectEventP(() => ({
    refetch,
  }))

  useEffect(() => {
    nonReactiveState().refetch()
  }, [currentUserBoardId, nonReactiveState])

  return {
    boardStatus: isLoading ? 'loading' : isSuccess ? 'success' : 'error',
  } as const
}
