import { ReactNode, useContext, useState } from 'react'
import { boardDataContext } from '../BoardData/constants'
import { onBoardingContext } from './constants'
import { useGuidanceText } from './hooks/useGuidanceText'

interface Props {
  children: ReactNode
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
