import { AUTH_TOKEN_KEY } from '@/contexts/User/constants'
import { useLocalStorage } from '@mantine/hooks'

export function useQueryKey() {
  const [authToken] = useLocalStorage<string>({
    key: AUTH_TOKEN_KEY,
  })

  return ['boards', authToken]
}
