import { useHash } from '@mantine/hooks'
import { useEffect } from 'react'
import { useEffectEventP } from '../../../contants'
import { TOKEN_PREFIX } from '../constants'

export const useHandleUserGoogleLogin = ({
  storeInLocalStorage,
}: {
  storeInLocalStorage: (token: string) => void
}) => {
  const [hash, setHash] = useHash()

  const nonReactiveState = useEffectEventP(() => ({ storeInLocalStorage }))

  useEffect(() => {
    ;(async () => {
      const { storeInLocalStorage } = nonReactiveState()
      if (hash.startsWith(TOKEN_PREFIX)) {
        const token = hash.slice(TOKEN_PREFIX.length)
        storeInLocalStorage(token)
        setHash('')
      }
    })()
  }, [hash, setHash, nonReactiveState])
}
