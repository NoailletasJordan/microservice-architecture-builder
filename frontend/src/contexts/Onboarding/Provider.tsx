import { ReactNode, useContext, useState } from 'react'
import { boardDataContext } from '../BoardData/constants'
import { onBoardingContext } from './constants'
import { useGuidanceText } from './hooks/useGuidanceText'

interface Props {
  children: ReactNode
}

export default function OnboardingContextProvider({ children }: Props) {
  const [showInfosModal, setShowInfosModal] = useState(false)
  const { nodes } = useContext(boardDataContext)
  const { showGuidanceTexts } = useGuidanceText({ nodes, showInfosModal })

  return (
    <onBoardingContext.Provider
      value={{
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
