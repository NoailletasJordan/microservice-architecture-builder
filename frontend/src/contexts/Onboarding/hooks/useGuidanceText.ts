import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useLayoutEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function useGuidanceText({
  nodes,
  showOnboarding,
}: {
  nodes: TCustomNode[]
  showOnboarding: boolean
}) {
  const [showGuidanceTexts, setShowGuidanceTexts] = useState<boolean>(false)
  const location = useLocation()
  const hasHash = !!location.hash

  const hasAtLeastOneService = useMemo(() => !!nodes.length, [nodes])

  useLayoutEffect(() => {
    setShowGuidanceTexts(() => {
      return !showOnboarding && !hasAtLeastOneService && !hasHash
    })
  }, [showOnboarding, hasAtLeastOneService, hasHash])

  return { showGuidanceTexts }
}
