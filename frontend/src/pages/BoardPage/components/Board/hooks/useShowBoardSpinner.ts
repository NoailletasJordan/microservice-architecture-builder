import { boardDataContext } from '@/contexts/BoardData/constants'
import { useContext } from 'react'

export function useShowBoardSpinner() {
  const { boardDataQuery } = useContext(boardDataContext)

  return !boardDataQuery.isFetched
}
