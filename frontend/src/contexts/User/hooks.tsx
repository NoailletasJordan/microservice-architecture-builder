import { useHash, useLocalStorage } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { AUTH_TOKEN_KEY, IUser, TBoardModel, TOKEN_PREFIX } from './constants'

export function useUser() {
  const [authToken] = useLocalStorage<string>({
    key: AUTH_TOKEN_KEY,
  })

  return useQuery<IUser>({
    enabled: !!authToken,
    queryKey: ['user', authToken],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((res) => res.json()),
    staleTime: Infinity,
  })
}

export function useBoards() {
  const [authToken] = useLocalStorage<string>({
    key: AUTH_TOKEN_KEY,
  })

  return useQuery<TBoardModel[]>({
    enabled: !!authToken,
    queryKey: ['boards', authToken],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/board`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((res) => res.json()),
    staleTime: Infinity,
  })
}

export const useHandleUserGoogleLogin = ({
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
