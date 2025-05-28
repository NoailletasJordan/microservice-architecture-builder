import { useLocalStorage } from '@mantine/hooks'
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

  if (userQuery.isError) {
    queryClient.setQueryData(['user', authToken], undefined)
    removeAuthToken()
  }

  const isLogged = Boolean(
    userQuery.data && !('error' in userQuery.data) && !!userQuery.data?.id,
  )

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
