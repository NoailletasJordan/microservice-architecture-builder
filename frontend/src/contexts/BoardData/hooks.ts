import {
  getDataToStoreObject,
  showNotificationError,
  useEffectEventP,
} from '@/contants'
import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import {
  STORAGE_DATA_INDEX_KEY,
  TCustomNode,
} from '@/pages/BoardPage/configs/constants'
import { storeInLocal } from '@/pages/BoardPage/configs/helpers'
import { readLocalStorageValue } from '@mantine/hooks'
import { useContext, useEffect, useState } from 'react'
import { useEdgesState, useNodesState, useReactFlow } from 'reactflow'
import {
  AUTH_TOKEN_KEY,
  BackendQueryResponse,
  userContext,
} from '../User/constants'
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

  // Save board to localstorage, debounced
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

export function useHandleSwitchBoardData({
  setNodes,
  setEdges,
}: {
  setNodes: React.Dispatch<React.SetStateAction<TCustomNode[]>>
  setEdges: React.Dispatch<React.SetStateAction<TCustomEdge[]>>
}) {
  const [boardStatus, setBoardStatus] =
    useState<BoardDataContext['boardStatus']>('loading')

  const { fitView } = useReactFlow()

  const { currentUserBoardId } = useContext(userBoardsContext)

  const stateMemo = useEffectEventP(() => ({
    setEdges,
    setNodes,
    fitView: () => fitView({ duration: 700 }),
  }))
  // Switch board data when user logs in or out
  useEffect(() => {
    let isMounted = true

    ;(async () => {
      if (!isMounted) return
      setBoardStatus('loading')
      const { fitView, setNodes, setEdges } = stateMemo()

      if (!currentUserBoardId) {
        const localData = readLocalStorageValue({
          key: STORAGE_DATA_INDEX_KEY,
          defaultValue: { timestamp: new Date(), nodes: [], edges: [] },
        })
        if (isMounted) {
          setNodes(localData.nodes)
          setEdges(localData.edges)
          setTimeout(() => fitView(), 100)
          setBoardStatus('success')
        }
        return
      }

      const authToken = readLocalStorageValue({ key: AUTH_TOKEN_KEY })
      if (!authToken && isMounted) {
        showNotificationError('Authentication required')
        setBoardStatus('error')
        return
      }

      try {
        const response: BackendQueryResponse<TBoardModel> | { error: string } =
          await fetch(
            `${import.meta.env.VITE_API_URL}/api/board/${currentUserBoardId}`,
            {
              headers: { Authorization: `Bearer ${authToken}` },
            },
          ).then((res) => res.json())

        if (isMounted) {
          if ('error' in response || !response) {
            showNotificationError('Error loading board')
            setBoardStatus('error')
            return
          }
          // apply remote board and remove local storage
          const { nodes, edges } = JSON.parse(response.data)
          setNodes(nodes)
          setEdges(edges)
          localStorage.removeItem(STORAGE_DATA_INDEX_KEY)
          setTimeout(() => fitView(), 100)
          setBoardStatus('success')
        }
      } catch (error) {
        if (isMounted) {
          showNotificationError(
            error instanceof Error
              ? error.message
              : 'Error fetching specific board',
          )
          setBoardStatus('error')
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [currentUserBoardId, stateMemo])

  return { boardStatus }
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
