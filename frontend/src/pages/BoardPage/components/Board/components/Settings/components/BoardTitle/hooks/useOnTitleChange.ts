import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { useContext } from 'react'
import { useUpdateTitleLocally } from './useUpdateTitleLocally'

export default function useOnTitleChange() {
  const { currentUserBoardId } = useContext(userBoardsContext)
  const updateTitleLocally = useUpdateTitleLocally()

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!currentUserBoardId) return
    updateTitleLocally(e.target.value)
  }
  return onChange
}
