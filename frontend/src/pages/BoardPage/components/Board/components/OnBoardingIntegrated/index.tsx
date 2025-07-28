import { onBoardingContext } from '@/contexts/Onboarding/constants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useNodes } from '@xyflow/react'
import { useContext, useMemo } from 'react'
import StepFirstNodeCreated from './components/StepFirstNodeCreated'
import StepSecondNodeCreated from './components/StepSecondNodeCreated'

export default function OnBoardingIntegrated() {
  const nodes = useNodes<TCustomNode>()
  const { onboardingStepIndex, onboardingIsActive } =
    useContext(onBoardingContext)

  const component = useMemo(() => {
    if (onboardingStepIndex === 1 && nodes.length === 1) {
      return <StepFirstNodeCreated firstNode={nodes[0]} />
    } else if (onboardingStepIndex === 2 && nodes.length >= 2) {
      return (
        <StepSecondNodeCreated firstNode={nodes[0]} secondNode={nodes[1]} />
      )
    }
    return null
  }, [onboardingStepIndex, nodes])

  if (!onboardingIsActive) return null
  return component
}
