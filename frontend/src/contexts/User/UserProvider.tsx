import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ThemeIcon } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconX } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { ReactNode, useCallback } from 'react'
import {
  AUTH_TOKEN_KEY,
  handlePushToGoogleOauth,
  userContext,
} from './constants'
import { useHandleUserGoogleLogin, useUser } from './hooks'

export default function UserProvider({ children }: { children: ReactNode }) {
  const [authToken, setAuthToken, removeAuthToken] = useLocalStorage({
    key: AUTH_TOKEN_KEY,
  })
  const userQuery = useUser()
  const queryClient = useQueryClient()

  if ((userQuery.data && 'error' in userQuery.data) || userQuery.error) {
    queryClient.setQueryData(['user', authToken], undefined)
    showNotificationError('Error loading user', userQuery.error)
    removeAuthToken()
  }

  const isLogged = !!userQuery.data

  useHandleUserGoogleLogin({
    storeInLocalStorage: (token) => setAuthToken(token),
  })

  const handleLogout = useCallback(() => {
    queryClient.setQueryData(['user', authToken], undefined)
    removeAuthToken()
  }, [authToken, queryClient, removeAuthToken])

  return (
    <userContext.Provider
      value={{
        isLogged,
        userQuery,
        authToken,
        handleLogout,
        handlePushToGoogleOauth,
      }}
    >
      {children}
    </userContext.Provider>
  )
}

export function showNotificationError(title: string, err?: unknown) {
  notifications.show({
    icon: (
      <ThemeIcon radius="xl" color="pink" variant="outline">
        <IconX style={ICON_STYLE} />
      </ThemeIcon>
    ),
    message: err instanceof Error ? err.message : 'Unknown error',
    title,
    autoClose: 6000,
  })
}
