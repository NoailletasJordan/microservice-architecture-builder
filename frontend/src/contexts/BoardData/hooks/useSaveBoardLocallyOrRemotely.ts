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
import { BoardDataContext } from '../constants'

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
