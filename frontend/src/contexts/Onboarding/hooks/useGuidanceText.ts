import { boardDataContext } from '@/contexts/BoardData/constants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
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
  const {
    boardDataQuery: { isFetched },
  } = useContext(boardDataContext)

  const hasAtLeastOneService = useMemo(() => !!nodes.length, [nodes])

  useLayoutEffect(() => {
    setShowGuidanceTexts(() => {
      return !showOnboarding && !hasAtLeastOneService && !hasHash && isFetched
    })
  }, [showOnboarding, hasAtLeastOneService, hasHash, isFetched])

  return { showGuidanceTexts }
}
