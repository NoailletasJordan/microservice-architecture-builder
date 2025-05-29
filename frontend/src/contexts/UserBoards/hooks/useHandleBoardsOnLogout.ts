import { showNotificationSuccess } from '@/contants'
import { userContext } from '@/contexts/User/constants'
import { useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useRef } from 'react'
import { useQueryKey } from './useQueryKey'

export function useHandleBoardsOnLogout({
  resetCurrentUserBoardId,
}: {
  resetCurrentUserBoardId: () => void
}) {
  const { isLogged } = useContext(userContext)
  const queryKey = useQueryKey()
  const queryClient = useQueryClient()

  const wasLoggedBefore = useRef(false)

  useEffect(() => {
    if (isLogged) wasLoggedBefore.current = true

    if (!isLogged && wasLoggedBefore.current) {
      wasLoggedBefore.current = false
      queryClient.removeQueries({ queryKey })
      queryClient.setQueryData(queryKey, undefined)
      resetCurrentUserBoardId()
      showNotificationSuccess({
        title: "You're logged out",
        message: 'I will now save your work on your browser',
      })
    }
  }, [isLogged])
}
