import { useStore } from '@xyflow/react'
import { useEffect, useState } from 'react'

interface Props {
  isOnboarding: boolean
}

export function useOnboardingStepNavigation_({ isOnboarding }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const nodesNumber = useStore((store) => store.nodes.length)
  const edgesNumber = useStore((store) => store.edges.length)

  useEffect(() => {
    if (!isOnboarding) return

    if (currentStepIndex === 0) {
      // Activate step 1 if there is only one node
      if (nodesNumber === 1) {
        setCurrentStepIndex(1)
      }
    }

    if (currentStepIndex === 1) {
      // Activate step 2 if there is two nodes and no edges
      if (nodesNumber === 2 && edgesNumber === 0) {
        setCurrentStepIndex(2)
      }
    }

    if (currentStepIndex === 2) {
      // Activate step 3 if there is one edge
      if (edgesNumber === 1) {
        setCurrentStepIndex(3)
      }
    }
  }, [currentStepIndex, isOnboarding, nodesNumber, edgesNumber])

  return {
    currentStepIndex,
    setCurrentStepIndex,
  }
}
