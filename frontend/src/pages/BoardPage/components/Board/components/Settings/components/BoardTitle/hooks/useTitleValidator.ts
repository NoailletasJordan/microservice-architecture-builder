import { boardDataContext } from '@/contexts/BoardData/constants'
import { useContext } from 'react'

export function useTitleValidator() {
  const { title } = useContext(boardDataContext)
  let error = ''
  if (title.length < 2) {
    error = '2 charachers minimum'
  }

  const isError = error.length > 0
  return { error, isError }
}
