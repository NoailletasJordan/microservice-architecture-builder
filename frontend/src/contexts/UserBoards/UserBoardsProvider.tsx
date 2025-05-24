import { ReactNode, useContext } from 'react'
import { userContext } from '../User/constants'
import { userBoardsContext } from './constants'
import { useHandleBoardsOnLogout, useUserBoards } from './hooks'

interface IProps {
  children: ReactNode
}

export default function UserBoardsProvider({ children }: IProps) {
  const { isLogged } = useContext(userContext)

  useHandleBoardsOnLogout(isLogged)
  const boardsQuery = useUserBoards()

  console.log('boardQuery', boardsQuery)

  return (
    <userBoardsContext.Provider value={{ boardsQuery }}>
      {children}
    </userBoardsContext.Provider>
  )
}
