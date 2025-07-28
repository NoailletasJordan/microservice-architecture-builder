import { useLocalStorage } from '@mantine/hooks'
import { useCallback } from 'react'

const ONBOARDING_IS_FINISHED_KEY = 'onboarding-termined'

export function useIsOnboarding_() {
  const [isTerminated, setIsTerminated] = useLocalStorage({
    key: ONBOARDING_IS_FINISHED_KEY,
    defaultValue: Boolean(localStorage.getItem(ONBOARDING_IS_FINISHED_KEY)),
  })
  const isOnboarding = !isTerminated

  const terminateOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_IS_FINISHED_KEY, 'true')
    setIsTerminated(true)
  }, [setIsTerminated])

  return {
    isOnboarding,
    terminateOnboarding,
  }
}
