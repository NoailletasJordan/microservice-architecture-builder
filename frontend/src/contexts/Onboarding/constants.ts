import { createContext } from 'react'

export interface IOnboardingContext {
  showGuidanceTexts: boolean
  showOnboarding: boolean
  updateShowOnboarding: (show: boolean) => void
}

export const onBoardingContext = createContext<IOnboardingContext>({
  showGuidanceTexts: true,
  showOnboarding: false,
  updateShowOnboarding: () => {},
})
