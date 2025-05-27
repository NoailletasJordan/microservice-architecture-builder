import { getDataToStoreObject, useEffectEventP } from '@/contants'
import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import {
  STORAGE_DATA_INDEX_KEY,
  TCustomNode,
} from '@/pages/BoardPage/configs/constants'
import { storeInLocal } from '@/pages/BoardPage/configs/helpers'
import { useContext, useEffect } from 'react'
import { userContext } from '../User/constants'
import { userBoardsContext } from '../UserBoards/constants'
import { useMutateBoards } from '../UserBoards/hooks'

const DEBOUNCE_SAVE_MS = 600
export function useSaveBoardLocallyOrRemotely({
  nodes,
  edges,
}: {
  nodes: TCustomNode[]
  edges: TCustomEdge[]
}) {
  const { isLogged } = useContext(userContext)
  const boardmutator = useMutateBoards()
  const mutateInstanceMemo = useEffectEventP(
    (body: Parameters<typeof boardmutator.mutate>[0]) =>
      boardmutator.mutate(body),
  )

  const { currentUserBoard } = useContext(userBoardsContext)

  // Save board to localstorage, debounced
  useEffect(() => {
    const handle = setTimeout(() => {
      const dataToStore = getDataToStoreObject(nodes, edges)
      if (isLogged && currentUserBoard) {
        mutateInstanceMemo({
          payload: { data: dataToStore },
          method: 'PATCH',
          boardId: currentUserBoard,
        })
        console.log('Saved board to remote')
      } else {
        storeInLocal(STORAGE_DATA_INDEX_KEY, dataToStore)
        console.log('Saved board to local')
      }
    }, DEBOUNCE_SAVE_MS)

    return () => {
      clearTimeout(handle)
    }
  }, [nodes, edges, isLogged, mutateInstanceMemo, currentUserBoard])
}
