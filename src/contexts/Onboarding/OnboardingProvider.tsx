import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { ReactNode, useEffect, useState } from 'react'
import { onBoardingContext } from './constants'

interface Props {
  children: ReactNode
  nodes: TCustomNode[]
}

export default function OnboardingContextProvider({ children, nodes }: Props) {
  const [showOnBoarding, setShowOnboarding] = useState<boolean>(!nodes.length)
  const [hadNodesBefore, sethadNodesBefore] = useState(!!nodes.length)

  useEffect(() => {
    if (hadNodesBefore) return

    if (nodes.length) {
      sethadNodesBefore(true)
      setShowOnboarding(false)
    }
  }, [nodes, showOnBoarding, hadNodesBefore, sethadNodesBefore])

  return (
    <onBoardingContext.Provider value={{ showOnBoarding }}>
      {children}
    </onBoardingContext.Provider>
  )
}
