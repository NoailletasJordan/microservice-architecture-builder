import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { useQueryClient } from '@tanstack/react-query'
import { useQueryKey } from '../../../../../contexts/BoardData/hooks/useQueryKey'
import { TBoardDataStore } from './useSetNodes'

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
