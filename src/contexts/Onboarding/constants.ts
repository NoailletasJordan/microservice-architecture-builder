import { createContext } from 'react'

export interface IOnboardingContext {
  showOnBoarding: boolean
}

export const onBoardingContext = createContext<IOnboardingContext>({
  showOnBoarding: true,
})
