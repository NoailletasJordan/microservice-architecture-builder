import { onBoardingContext } from '@/contexts/Onboarding/constants'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'

interface UseStepNavigationProps {
  totalSteps: number
}

interface UseStepNavigationReturn {
  currentStepIndex: number
  isMovingForward: boolean
  isPreviousDisabled: boolean
  isNextDisabled: boolean
  goToNextStep: () => void
  goToPreviousStep: () => void
}

export function useStepNavigation_({
  totalSteps,
}: UseStepNavigationProps): UseStepNavigationReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const previousStepIndexRef = useRef(currentStepIndex)
  const isMovingForwardRef = useRef(true)
  const { onboardingStepIndex } = useContext(onBoardingContext)

  if (currentStepIndex !== previousStepIndexRef.current) {
    isMovingForwardRef.current = currentStepIndex > previousStepIndexRef.current
    previousStepIndexRef.current = currentStepIndex
  }

  const goToNextStep = useCallback(() => {
    setCurrentStepIndex((prev) =>
      Math.min(prev + 1, totalSteps - 1, onboardingStepIndex),
    )
  }, [totalSteps, onboardingStepIndex])

  const goToPreviousStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  useEffect(() => {
    setCurrentStepIndex(onboardingStepIndex)
  }, [onboardingStepIndex])

  const isPreviousDisabled = currentStepIndex === 0
  const isNextDisabled = currentStepIndex >= onboardingStepIndex
  const isMovingForward = isMovingForwardRef.current

  return {
    currentStepIndex,
    isMovingForward,
    isPreviousDisabled,
    isNextDisabled,
    goToNextStep,
    goToPreviousStep,
  }
}
