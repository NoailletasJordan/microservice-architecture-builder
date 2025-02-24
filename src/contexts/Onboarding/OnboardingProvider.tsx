import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { readLocalStorageValue } from '@mantine/hooks'
import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import { onBoardingContext } from './constants'

interface Props {
  children: ReactNode
  nodes: TCustomNode[]
}

const ONBOARDING_STORAGE_KEY = 'has-terminated-onboarding'
function useOnboarding() {
  const [showOnboarding, __setShowOnboarding] = useState(false)
  const updateShowOnboarding = useCallback((bool: boolean) => {
    if (!bool) {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
    }
    __setShowOnboarding(bool)
  }, [])

  useEffect(() => {
    const userPreviouslySeenOnboarding = readLocalStorageValue({
      key: ONBOARDING_STORAGE_KEY,
      defaultValue: false,
    })
    if (!userPreviouslySeenOnboarding) __setShowOnboarding(true)
  }, [])
  return { showOnboarding, updateShowOnboarding }
}

function useGuidanceText({
  nodes,
  showOnboarding,
}: {
  nodes: TCustomNode[]
  showOnboarding: boolean
}) {
  const [showGuidanceTexts, setShowGuidanceTexts] = useState<boolean>(false)
  const location = useLocation()
  const hasHash = !!location.hash

  const hasAtLeastOneService = useMemo(() => !!nodes.length, [nodes])

  useLayoutEffect(() => {
    setShowGuidanceTexts(() => {
      return !showOnboarding && !hasAtLeastOneService && !hasHash
    })
  }, [showOnboarding, hasAtLeastOneService, hasHash])

  return { showGuidanceTexts }
}

export default function OnboardingContextProvider({ children, nodes }: Props) {
  const { showOnboarding, updateShowOnboarding } = useOnboarding()
  const { showGuidanceTexts } = useGuidanceText({ nodes, showOnboarding })

  return (
    <onBoardingContext.Provider
      value={{
        showGuidanceTexts,
        showOnboarding,
        updateShowOnboarding,
      }}
    >
      {children}
    </onBoardingContext.Provider>
  )
}
