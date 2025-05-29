import { useHash } from '@mantine/hooks'
import { useEffect, useRef } from 'react'
import { TOKEN_PREFIX } from '../constants'

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
