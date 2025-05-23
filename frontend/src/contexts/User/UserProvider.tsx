import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ThemeIcon } from '@mantine/core'
import { readLocalStorageValue, useHash, useLocalStorage } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconX } from '@tabler/icons-react'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { IUser, TBoardModel, userContext } from './constants'

const TOKEN_PREFIX = '#auth-token='
const AUTH_TOKEN_KEY = 'auth-token'

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | undefined>(undefined)
  const isLogged = !!user

  const [authToken, __setAuthToken, removeAuthToken] = useLocalStorage({
    key: AUTH_TOKEN_KEY,
  })

  const setAuthTokenRef = useRef(__setAuthToken)
  setAuthTokenRef.current = __setAuthToken
  const handleUpdateUser = useCallback(
    ({ user, authToken }: { user: IUser; authToken: string }) => {
      setUser(user)
      setAuthTokenRef.current(authToken)
    },
    [],
  )

  useInitialUserFromToken({ handleUpdateUser })
  useHandleUserGoogleLogin({ handleUpdateUser })

  const handleLogout = useCallback(() => {
    setUser(undefined)

    removeAuthToken()
  }, [removeAuthToken])

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

type HandleUpdateUser = ({
  user,
  authToken,
}: {
  user: IUser
  authToken: string
}) => void

function useInitialUserFromToken({
  handleUpdateUser,
}: {
  handleUpdateUser: HandleUpdateUser
}) {
  const handleUpdateUserRef = useRef(handleUpdateUser)
  handleUpdateUserRef.current = handleUpdateUser
  useEffect(() => {
    ;(async () => {
      const authToken = readLocalStorageValue({
        key: AUTH_TOKEN_KEY,
        defaultValue: '',
      })
      if (!!authToken) {
        const user = await handleFetchUser({ token: authToken })
        const boards = await handleFetchBoards({ token: authToken })
        if (user && boards) {
          user.boards = boards
          handleUpdateUserRef.current({ user, authToken })
        }
      }
    })()
  }, [handleUpdateUserRef])
}

const useHandleUserGoogleLogin = ({
  handleUpdateUser,
}: {
  handleUpdateUser: HandleUpdateUser
}) => {
  const [hash, setHash] = useHash()
  const handleUpdateUserRef = useRef(handleUpdateUser)
  handleUpdateUserRef.current = handleUpdateUser
  useEffect(() => {
    ;(async () => {
      if (hash.startsWith(TOKEN_PREFIX)) {
        const token = hash.slice(TOKEN_PREFIX.length)
        setHash('')
        const user = await handleFetchUser({ token })
        const boards = await handleFetchBoards({ token })
        if (user && boards) {
          user.boards = boards
          handleUpdateUserRef.current({ user, authToken: token })
        }
      }
    })()
  }, [hash, setHash])
}

async function handleFetchUser({
  token,
}: {
  token: string
}): Promise<IUser | undefined> {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Failed to fetch user')
    const userObj = await res.json()
    return userObj
  } catch (err) {
    console.error('Auth error:', err)
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
    return undefined
  }
}

async function handleFetchBoards({
  token,
}: {
  token: string
}): Promise<TBoardModel[] | undefined> {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/board`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Failed to fetch boards')
    const boardsObj = await res.json()
    return boardsObj
  } catch (err) {
    console.error('Auth error:', err)
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
    return undefined
  }
}
