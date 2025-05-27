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
import { useEdgesState, useNodesState } from 'reactflow'
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

  const { currentUserBoardId } = useContext(userBoardsContext)

  const stateMemo = useEffectEventP(() => ({
    setEdges,
    setNodes,
  }))
  // Switch board data when user logs in or out
  useEffect(() => {
    let isMounted = true

    ;(async () => {
      if (!isMounted) return
      setBoardStatus('loading')

      if (!currentUserBoardId) {
        const localData = readLocalStorageValue({
          key: STORAGE_DATA_INDEX_KEY,
          defaultValue: { timestamp: new Date(), nodes: [], edges: [] },
        })
        if (isMounted) {
          stateMemo().setNodes(localData.nodes)
          stateMemo().setEdges(localData.edges)
          setBoardStatus('success')
        }
        return
      }

      const authToken = readLocalStorageValue({ key: AUTH_TOKEN_KEY })
      if (!authToken && isMounted) {
        showNotificationError('Error loading board', 'Authentication required')
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
            showNotificationError('Error loading board', response.error)
            setBoardStatus('error')
            return
          }
          console.log('currentUserBoardId', currentUserBoardId)
          console.log('response', response)
          const { nodes, edges } = JSON.parse(response.data)
          stateMemo().setNodes(nodes)
          stateMemo().setEdges(edges)
          setBoardStatus('success')
        }
      } catch (error) {
        if (isMounted) {
          showNotificationError(
            'Error loading board',
            error instanceof Error ? error.message : 'Unknown error',
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
