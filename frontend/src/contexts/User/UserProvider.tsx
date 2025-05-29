import { useLocalStorage } from '@mantine/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { ReactNode, useCallback } from 'react'
import {
  AUTH_TOKEN_KEY,
  handlePushToGoogleOauth,
  userContext,
} from './constants'
import { useHandleUserGoogleLogin } from './hooks/useHandleUserGoogleLogin'
import { useUser } from './hooks/useUser'

export default function UserProvider({ children }: { children: ReactNode }) {
  const [authToken, setAuthToken, removeAuthToken] = useLocalStorage({
    key: AUTH_TOKEN_KEY,
  })
  const { userQuery, isLogged } = useUser({ removeAuthToken })
  const queryClient = useQueryClient()

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
