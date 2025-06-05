import { userContext } from '@/contexts/User/constants'
import { TBoardModel, userBoardsContext } from '@/contexts/UserBoards/constants'
import { TextInput } from '@mantine/core'
import { useContext } from 'react'

export default function BoardTitle() {
  const value = useBoardTitle()
  const onChange = useOnTitleChange()

  return (
    <TextInput onChange={onChange} value={value} fw="bold" variant="default" />
  )
}

function useOnTitleChange() {
  const { update: updateBoard, currentUserBoardId } =
    useContext(userBoardsContext)

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!currentUserBoardId) return

    updateBoard({
      boardId: currentUserBoardId!,
      payload: {
        title: e.target.value,
      },
    })
  }
  return onChange
}

function useBoardTitle() {
  const { boardsQuery, currentUserBoardId } = useContext(userBoardsContext)
  const { isLogged } = useContext(userContext)

  if (!isLogged) {
    return 'Local board'
  } else {
    if (!boardsQuery || !boardsQuery.data || 'error' in boardsQuery.data)
      return ''

    const boards = boardsQuery.data as TBoardModel[]
    const loggedTitle = boards.find(
      ({ id }) => id === currentUserBoardId,
    )?.title

    return loggedTitle
  }
}
