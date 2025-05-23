import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ThemeIcon } from '@mantine/core'
import { useHash, useLocalStorage } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconX } from '@tabler/icons-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ReactNode, useCallback, useEffect, useRef } from 'react'
import { userContext } from './constants'

const TOKEN_PREFIX = '#auth-token='
const AUTH_TOKEN_KEY = 'auth-token'

export default function UserProvider({ children }: { children: ReactNode }) {
  const [authToken, setAuthToken, removeAuthToken] = useLocalStorage({
    key: AUTH_TOKEN_KEY,
  })

  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    enabled: !!authToken,
    queryKey: ['user', authToken],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((res) => res.json())
        .catch((err) => {
          showNotificationError(err)
          return
        }),
  })

  const isLogged = !!user

  useHandleUserGoogleLogin({
    storeInLocalStorage: (token) => setAuthToken(token),
  })

  const queryClient = useQueryClient()
  const handleLogout = useCallback(() => {
    queryClient.setQueryData(['user', authToken], undefined)
    removeAuthToken()
  }, [authToken, queryClient, removeAuthToken])

  const handlePushToGoogleOauth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login`
  }

  return (
    <userContext.Provider
      value={{
        isLogged,
        user,
        authToken,
        handleLogout,
        handlePushToGoogleOauth,
      }}
    >
      {children}
    </userContext.Provider>
  )
}

const useHandleUserGoogleLogin = ({
  storeInLocalStorage,
}: {
  storeInLocalStorage: (token: string) => void
}) => {
  const [hash, setHash] = useHash()
  const storeInLocalStorageRef = useRef(storeInLocalStorage)
  storeInLocalStorageRef.current = storeInLocalStorage

  useEffect(() => {
    ;(async () => {
      if (hash.startsWith(TOKEN_PREFIX)) {
        const token = hash.slice(TOKEN_PREFIX.length)
        storeInLocalStorageRef.current(token)
        setHash('')
      }
    })()
  }, [hash, setHash])
}

function showNotificationError(err: unknown) {
  notifications.show({
    icon: (
      <ThemeIcon radius="xl" color="pink" variant="outline">
        <IconX style={ICON_STYLE} />
      </ThemeIcon>
    ),
    message: err instanceof Error ? err.message : 'Unknown error',
    title: 'Error loading user',
    autoClose: 6000,
  })
}
