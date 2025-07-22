import { createContext } from 'react'

export interface IOnboardingContext {
  showGuidanceTexts: boolean
  showInfosModal: boolean
  updateShowInfosModal: (show: boolean) => void
}

export const onBoardingContext = createContext<IOnboardingContext>({
  showGuidanceTexts: true,
  showInfosModal: false,
  updateShowInfosModal: () => {},
})
