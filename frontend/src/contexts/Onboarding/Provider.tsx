import { ReactNode, useContext, useState } from 'react'
import { boardDataContext } from '../BoardData/constants'
import { onBoardingContext } from './constants'
import { useGuidanceText } from './hooks/useGuidanceText'
import { useIsOnboarding_ } from './hooks/useIsOnboarding'
import { useOnboardingStepNavigation_ } from './hooks/useOnboardingStepNavigation_'

interface Props {
  children: ReactNode
}
export default function OnboardingContextProvider({ children }: Props) {
  const [showInfosModal, setShowInfosModal] = useState(false)
  const { nodes } = useContext(boardDataContext)
  const { showGuidanceTexts } = useGuidanceText({ nodes, showInfosModal })
  const { isOnboarding, terminateOnboarding } = useIsOnboarding_()
  const { currentStepIndex, setCurrentStepIndex } =
    useOnboardingStepNavigation_({ isOnboarding })

  return (
    <onBoardingContext.Provider
      value={{
        onboardingIsActive: isOnboarding,
        onboardingStepIndex: currentStepIndex,
        terminateOnboarding,
        updateCurrentOnboardingStepIndex: setCurrentStepIndex,
        showGuidanceTexts,
        showInfosModal,
        updateShowInfosModal: (bool: boolean) => {
          setShowInfosModal(bool)
        },
      }}
    >
      {children}
    </onBoardingContext.Provider>
  )
}
