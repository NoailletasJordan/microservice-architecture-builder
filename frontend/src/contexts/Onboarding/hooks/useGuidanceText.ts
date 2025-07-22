import { boardDataContext } from '@/contexts/BoardData/constants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function useGuidanceText({
  nodes,
  showInfosModal,
}: {
  nodes: TCustomNode[]
  showInfosModal: boolean
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
      return !showInfosModal && !hasAtLeastOneService && !hasHash && isFetched
    })
  }, [showInfosModal, hasAtLeastOneService, hasHash, isFetched])

  return { showGuidanceTexts }
}
