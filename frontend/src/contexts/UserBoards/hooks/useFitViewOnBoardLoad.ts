import { useEffectEventP } from '@/contants'
import { useEffect } from 'react'
import { useReactFlow } from 'reactflow'

export default function useFitViewOnBoardLoad({
  isFetched,
  currentUserBoardId,
}: {
  isFetched: boolean
  currentUserBoardId: string | undefined
}) {
  const FIT_VIEW_DURATION = 700
  const { fitView } = useReactFlow()
  const nonReactiveState = useEffectEventP(() => ({
    fitView,
  }))

  useEffect(() => {
    const { fitView } = nonReactiveState()
    if (isFetched) {
      setTimeout(() => {
        fitView({ duration: FIT_VIEW_DURATION })
      }, 100)
    }

    return () => {}
  }, [currentUserBoardId, isFetched, nonReactiveState])
}
