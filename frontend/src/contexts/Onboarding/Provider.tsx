import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import {
  ReactNode,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import { boardDataContext } from '../BoardData/constants'
import { onBoardingContext } from './constants'

interface Props {
  children: ReactNode
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

export default function OnboardingContextProvider({ children }: Props) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { nodes } = useContext(boardDataContext)
  const { showGuidanceTexts } = useGuidanceText({ nodes, showOnboarding })

  return (
    <onBoardingContext.Provider
      value={{
        showGuidanceTexts,
        showOnboarding,
        updateShowOnboarding: (bool: boolean) => {
          setShowOnboarding(bool)
        },
      }}
    >
      {children}
    </onBoardingContext.Provider>
  )
}
