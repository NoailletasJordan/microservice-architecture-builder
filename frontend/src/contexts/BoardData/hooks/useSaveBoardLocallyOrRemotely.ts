import { getDataToStoreObject, useEffectEventP } from '@/contants'
import { userContext } from '@/contexts/User/constants'
import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import {
  STORAGE_DATA_INDEX_KEY,
  TCustomNode,
} from '@/pages/BoardPage/configs/constants'
import { storeInLocal } from '@/pages/BoardPage/configs/helpers'
import { useContext, useEffect } from 'react'

const DEBOUNCE_SAVE_MS = 600

export function useSaveBoardLocallyOrRemotely({
  nodes,
  edges,
  requestStatus,
}: {
  nodes: TCustomNode[]
  edges: TCustomEdge[]
  requestStatus: 'pending' | 'success' | 'error'
}) {
  const { isLogged } = useContext(userContext)
  const { currentUserBoardId } = useContext(userBoardsContext)

  const { update } = useContext(userBoardsContext)
  const nonReactiveState = useEffectEventP(() => ({
    currentUserBoardId,
    update,
    requestStatus,
    isLogged,
  }))

  // Save board, debounced
  useEffect(() => {
    const { requestStatus, currentUserBoardId, update, isLogged } =
      nonReactiveState()
    if (requestStatus !== 'success') return
    const handle = setTimeout(() => {
      const dataToStore = getDataToStoreObject(nodes, edges)
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
  }, [nodes, edges, nonReactiveState])
}
