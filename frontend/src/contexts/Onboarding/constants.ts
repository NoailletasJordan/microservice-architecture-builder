import { createContext } from 'react'

export interface IOnboardingContext {
  onboardingIsActive: boolean
  onboardingStepIndex: number
  showGuidanceTexts: boolean
  showInfosModal: boolean
  updateShowInfosModal: (show: boolean) => void
  terminateOnboarding: () => void
  updateCurrentOnboardingStepIndex: (index: number) => void
}

export const onBoardingContext = createContext<IOnboardingContext>({
  terminateOnboarding: () => {},
  updateCurrentOnboardingStepIndex: () => {},
  onboardingIsActive: false,
  onboardingStepIndex: 0,
  showGuidanceTexts: true,
  showInfosModal: false,
  updateShowInfosModal: () => {},
})

// Step 0 : Welcome, create first node then
// Step 1 : Service axplanation, create second node then
// Step 2 : , create connexion then
// Step 3 : Congrats, you finished, click ok then
// Step 4 : setTerminated true. nothing
