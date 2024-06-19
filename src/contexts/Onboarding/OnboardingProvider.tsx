import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { ReactNode, useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { onBoardingContext } from './constants'

interface Props {
  children: ReactNode
  nodes: TCustomNode[]
}

export default function OnboardingContextProvider({ children, nodes }: Props) {
  const [showOnBoarding, setShowOnboarding] = useState<boolean>(!nodes.length)
  const [hadNodesBefore, sethadNodesBefore] = useState(!!nodes.length)
  const location = useLocation()
  const hasHash = !!location.hash

  useLayoutEffect(() => {
    if (hadNodesBefore) return

    if (nodes.length || hasHash) {
      sethadNodesBefore(true)
      setShowOnboarding(false)
    }
  }, [nodes, showOnBoarding, hadNodesBefore, sethadNodesBefore, hasHash])

  return (
    <onBoardingContext.Provider value={{ showOnBoarding }}>
      {children}
    </onBoardingContext.Provider>
  )
}
