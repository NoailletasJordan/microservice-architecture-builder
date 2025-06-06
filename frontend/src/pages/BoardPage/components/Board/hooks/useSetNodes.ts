import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useQueryClient } from '@tanstack/react-query'
import { useQueryKey } from '../../../../../contexts/BoardData/hooks/useQueryKey'

export type TBoardDataStore = {
  nodes: TCustomNode[]
  edges: TCustomEdge[]
  title: string
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
    const newState = { ...oldData, nodes: newNodes }

    queryClient.setQueryData(queryKey, newState)
  }

  return setNodes
}
