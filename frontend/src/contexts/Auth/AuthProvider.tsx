import { useHash } from '@mantine/hooks'
import { ReactNode, useEffect, useState } from 'react'
import { AuthContext, IUser } from './constants'

const TOKEN_PREFIX = '#auth-token='

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | undefined>(undefined)
  const isLogged = !!user
  const [hash, setHash] = useHash()

  useEffect(() => {
    ;(async () => {
      if (hash.startsWith(TOKEN_PREFIX)) {
        const token = hash.slice(TOKEN_PREFIX.length)
        console.log('Auth token:', token)
        await fetchUser({ updateUser: setUser, token })
        setHash('')
      }
    })()
  }, [hash, setHash])

  return (
    <AuthContext.Provider value={{ isLogged, user }}>
      {children}
    </AuthContext.Provider>
  )
}

async function fetchUser({
  updateUser,
  token,
}: {
  updateUser: (user?: IUser) => void
  token: string
}) {
  try {
    // Just pass the token as Bearer, no decoding
    // Try /users/me (recommended), fallback to /users/{id} if needed
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Failed to fetch user')
    const userObj = await res.json()
    console.log('User retrieved:', userObj)
    updateUser(userObj)
  } catch (err) {
    console.error('Auth error:', err)
    updateUser(undefined)
  }
}
