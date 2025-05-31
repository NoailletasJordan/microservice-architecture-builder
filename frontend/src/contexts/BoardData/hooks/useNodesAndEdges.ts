import { AUTH_TOKEN_KEY } from '@/contexts/User/constants'
import { TBoardModel } from '@/contexts/UserBoards/constants'
import { STORAGE_DATA_INDEX_KEY } from '@/pages/BoardPage/configs/constants'
import { readLocalStorageValue } from '@mantine/hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useReactFlow } from 'reactflow'
import { useQueryKey } from './useQueryKey'

export function useNodesAndEdges() {
  const FIT_VIEW_DURATION = 700
  const { fitView } = useReactFlow()
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()

  const { status: boardStatus, data } = useQuery({
    queryKey,
    placeholderData: {
      nodes: [],
      edges: [],
    },
    queryFn: async ({ queryKey }) => {
      const [_, currentUserBoardId] = queryKey

      if (!currentUserBoardId) {
        // If no board id (including not logged), load local data
        const localData = readLocalStorageValue({
          key: STORAGE_DATA_INDEX_KEY,
          defaultValue: { timestamp: new Date(), nodes: [], edges: [] },
        })

        setTimeout(() => fitView({ duration: FIT_VIEW_DURATION }), 100)
        return { nodes: localData.nodes, edges: localData.edges }
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

        // apply remote board and remove local storage and cache
        const { nodes, edges } = JSON.parse(response.data)
        localStorage.removeItem(STORAGE_DATA_INDEX_KEY)
        const logoutQueryKey = [queryKey[0], null]
        queryClient.setQueryData(logoutQueryKey, { nodes: [], edges: [] })
        setTimeout(() => fitView({ duration: FIT_VIEW_DURATION }), 100)
        return { nodes, edges }
      }
    },
    staleTime: Infinity,
  })

  const nodes = data?.nodes || []
  const edges = data?.edges || []

  return {
    nodes,
    edges,
    boardStatus,
  }
}
