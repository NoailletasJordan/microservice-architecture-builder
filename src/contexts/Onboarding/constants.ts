import { createContext } from 'react'

export interface IOnboardingContext {
  showOnBoarding: boolean
  updateShowOnBoarding: (show: boolean) => void
}

export const onBoardingContext = createContext<IOnboardingContext>({
  showOnBoarding: true,
  updateShowOnBoarding: () => {},
})
