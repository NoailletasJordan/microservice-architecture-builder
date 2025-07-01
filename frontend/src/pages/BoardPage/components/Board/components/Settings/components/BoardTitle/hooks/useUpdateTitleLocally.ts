import { TBoardDataStore } from '@/pages/BoardPage/components/Board/hooks/useSetNodes'
import { useQueryClient } from '@tanstack/react-query'
import { useQueryKey } from '../../../../../../../../../contexts/BoardData/hooks/useQueryKey'

export function useUpdateTitleLocally() {
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()

  const updateTitle = (newTitle: string) => {
    const oldData = queryClient.getQueryData(queryKey) as TBoardDataStore
    const newState = { ...oldData, title: newTitle }

    queryClient.setQueryData(queryKey, newState)
  }

  return updateTitle
}
