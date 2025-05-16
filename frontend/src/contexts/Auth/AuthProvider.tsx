import { readLocalStorageValue, useHash, useLocalStorage } from '@mantine/hooks'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { AuthContext, IUser } from './constants'

const TOKEN_PREFIX = '#auth-token='
const AUTH_TOKEN_KEY = 'auth-token'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | undefined>(undefined)
  const isLogged = !!user

  const [_authToken, _setAuthToken, removeAuthToken] = useLocalStorage({
    key: AUTH_TOKEN_KEY,
  })

  const handleUpdateUser = useCallback(
    ({ user, authToken }: { user: IUser; authToken: string }) => {
      setUser(user)
      localStorage.setItem(AUTH_TOKEN_KEY, authToken)
    },
    [],
  )

  useInitialUserFromToken({ handleUpdateUser })
  useHandleUserGoogleLogin({ handleUpdateUser })

  const handleLogout = useCallback(() => {
    setUser(undefined)
    removeAuthToken()
  }, [removeAuthToken])

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login`
  }

  return (
    <AuthContext.Provider value={{ isLogged, user, handleLogout, handleLogin }}>
      {children}
    </AuthContext.Provider>
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
        const user = await fetchUser({ token: authToken })
        if (user) {
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
        const user = await fetchUser({ token })
        if (user) {
          handleUpdateUserRef.current({ user, authToken: token })
        }
      }
    })()
  }, [hash, setHash])
}

async function fetchUser({
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
    return undefined
  }
}
