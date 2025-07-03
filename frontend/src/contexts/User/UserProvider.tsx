import { useLocalStorage } from '@mantine/hooks'
import { ReactNode, useCallback } from 'react'
import {
  AUTH_TOKEN_KEY,
  handlePushToGoogleOauth,
  userContext,
} from './constants'
import { useHandleUserGoogleLogin } from './hooks/useHandleUserGoogleLogin'
import { useUser } from './hooks/useUser'

export default function UserProvider({ children }: { children: ReactNode }) {
  const [authToken, setAuthToken] = useLocalStorage<string>({
    key: AUTH_TOKEN_KEY,
    defaultValue: localStorage.getItem(AUTH_TOKEN_KEY) || '',
  })

  const removeAuthToken = useCallback(() => {
    setAuthToken('')
  }, [setAuthToken])

  const { userQuery, isLogged } = useUser({ removeAuthToken })

  useHandleUserGoogleLogin({
    storeInLocalStorage: (token) => setAuthToken(token),
  })

  return (
    <userContext.Provider
      value={{
        isLogged,
        userQuery,
        authToken,
        handleLogout: removeAuthToken,
        handlePushToGoogleOauth,
      }}
    >
      {children}
    </userContext.Provider>
  )
}
