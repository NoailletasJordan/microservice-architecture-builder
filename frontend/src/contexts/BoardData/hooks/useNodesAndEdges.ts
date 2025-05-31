import { AUTH_TOKEN_KEY } from '@/contexts/User/constants'
import { TBoardModel, userBoardsContext } from '@/contexts/UserBoards/constants'
import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import {
  STORAGE_DATA_INDEX_KEY,
  TCustomNode,
} from '@/pages/BoardPage/configs/constants'
import { readLocalStorageValue } from '@mantine/hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import {
  applyEdgeChanges,
  applyNodeChanges,
  OnEdgesChange,
  OnNodesChange,
  useReactFlow,
} from 'reactflow'

function useQueryKey() {
  const { currentUserBoardId } = useContext(userBoardsContext)

  return ['board', currentUserBoardId]
}

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

type TBoardDataStore = {
  nodes: TCustomNode[]
  edges: TCustomEdge[]
}

export function useSetEdges() {
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()

  const setEdges = (
    callbackOrEdges:
      | ((oldEdges: TCustomEdge[]) => TCustomEdge[])
      | TCustomEdge[],
  ) => {
    const oldData = queryClient.getQueryData(queryKey) as TBoardDataStore
    const newEdges =
      typeof callbackOrEdges === 'function'
        ? callbackOrEdges(oldData.edges)
        : callbackOrEdges
    const newState = JSON.parse(JSON.stringify({ ...oldData, edges: newEdges }))

    queryClient.setQueryData(queryKey, newState)
  }

  return setEdges
}

export function useSetNodes() {
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()

  const setNodes = (
    callbackOrNodes:
      | ((oldNodes: TCustomNode[]) => TCustomNode[])
      | TCustomNode[],
  ) => {
    const oldData = queryClient.getQueryData(queryKey) as TBoardDataStore
    const newNodes =
      typeof callbackOrNodes === 'function'
        ? callbackOrNodes(oldData.nodes)
        : callbackOrNodes
    const newState = JSON.parse(JSON.stringify({ ...oldData, nodes: newNodes }))

    queryClient.setQueryData(queryKey, newState)
  }

  return setNodes
}

export function useOnNodesChange(): OnNodesChange {
  const setNodes = useSetNodes()

  return (changes) => setNodes((nds) => applyNodeChanges(changes, nds))
}

export function useOnEdgesChange(): OnEdgesChange {
  const setEdges = useSetEdges()

  return (changes) => setEdges((nds) => applyEdgeChanges(changes, nds))
}

export function useGetNode() {
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()

  function getNodes(id: TCustomNode['id']) {
    const { nodes } = queryClient.getQueryData(queryKey) as TBoardDataStore
    return nodes.find((node) => node.id === id)
  }
  return getNodes
}

export function useGetEdge() {
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()

  function getEdge(id: TCustomEdge['id']) {
    const { edges } = queryClient.getQueryData(queryKey) as TBoardDataStore
    return edges.find((edge) => edge.id === id)
  }
  return getEdge
}

export function useGetNodes() {
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()

  function getNodes() {
    const { nodes } = queryClient.getQueryData(queryKey) as TBoardDataStore
    return nodes
  }
  return getNodes
}

export function useGetEdges() {
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()

  function getEdges() {
    const { edges } = queryClient.getQueryData(queryKey) as TBoardDataStore
    return edges
  }
  return getEdges
}
