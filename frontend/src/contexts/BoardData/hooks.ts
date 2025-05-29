import { getDataToStoreObject, useEffectEventP } from '@/contants'
import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import {
  STORAGE_DATA_INDEX_KEY,
  TCustomNode,
} from '@/pages/BoardPage/configs/constants'
import { storeInLocal } from '@/pages/BoardPage/configs/helpers'
import { readLocalStorageValue, useLocalStorage } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { useContext, useEffect } from 'react'
import { useEdgesState, useNodesState, useReactFlow } from 'reactflow'
import { AUTH_TOKEN_KEY, userContext } from '../User/constants'
import { TBoardModel, userBoardsContext } from '../UserBoards/constants'
import { BoardDataContext } from './constants'

const DEBOUNCE_SAVE_MS = 600
export function useSaveBoardLocallyOrRemotely({
  nodes,
  edges,
  boardStatus,
}: {
  nodes: TCustomNode[]
  edges: TCustomEdge[]
  boardStatus: BoardDataContext['boardStatus']
}) {
  const { isLogged } = useContext(userContext)
  const { currentUserBoardId } = useContext(userBoardsContext)

  const { update } = useContext(userBoardsContext)
  const nonReactiveState = useEffectEventP(() => ({
    currentUserBoardId,
    update,
  }))

  // Save board, debounced
  useEffect(() => {
    if (boardStatus !== 'success') return
    const handle = setTimeout(() => {
      const dataToStore = getDataToStoreObject(nodes, edges)
      const { currentUserBoardId, update } = nonReactiveState()
      if (isLogged && currentUserBoardId) {
        update({
          boardId: currentUserBoardId,
          payload: { data: dataToStore },
        })
      } else {
        storeInLocal(STORAGE_DATA_INDEX_KEY, dataToStore)
      }
    }, DEBOUNCE_SAVE_MS)

    return () => {
      clearTimeout?.(handle)
    }
  }, [boardStatus, nodes, edges, isLogged, nonReactiveState])
}

function useTemp() {
  const [datafromStorage] = useLocalStorage({ key: STORAGE_DATA_INDEX_KEY })
  /** Temp */
  console.log('datafromStorage:', datafromStorage)
}

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
  // useTemp()

  const { isSuccess, isLoading, refetch } = useQuery({
    enabled: false,
    queryKey: ['board', currentUserBoardId],
    queryFn: async () => {
      // If no board id (including not logged), load local data
      /** Temp */
      console.log('calllll0', currentUserBoardId)
      if (!currentUserBoardId) {
        // const localData = readLocalStorageValue({
        //   key: STORAGE_DATA_INDEX_KEY,
        //   defaultValue: { timestamp: new Date(), nodes: [], edges: [] },
        // })
        let localData: any = localStorage.getItem(STORAGE_DATA_INDEX_KEY)
        if (!localData)
          localData = JSON.stringify({
            timestamp: new Date(),
            nodes: [],
            edges: [],
          })
        localData = JSON.parse(localData)

        /** Temp */
        console.log('calllll no id:', localData)
        setNodes([])
        setEdges([])
        // setNodes(localData.nodes)
        // setEdges(localData.edges)
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

export function useNodesAndEdges() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const { boardStatus } = useHandleSwitchBoardData({
    setNodes,
    setEdges,
  })

  return {
    boardStatus,
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
  }
}
