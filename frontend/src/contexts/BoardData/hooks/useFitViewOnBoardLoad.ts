import { useEffectEventP } from '@/contants'
import { useEffect } from 'react'
import { useReactFlow } from 'reactflow'
import { useQueryKey } from './useQueryKey'

export default function useFitViewOnBoardLoad({
  isFetched,
}: {
  isFetched: boolean
}) {
  const [_, boardId] = useQueryKey()
  const FIT_VIEW_DURATION = 700
  const { fitView } = useReactFlow()
  const nonReactiveState = useEffectEventP(() => ({
    fitView,
  }))

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (isFetched) {
      const { fitView } = nonReactiveState()
      timeout = setTimeout(() => {
        fitView({ duration: FIT_VIEW_DURATION, maxZoom: 1, minZoom: 0.65 })
      }, 50)
    }

    return () => {
      timeout && clearTimeout(timeout)
    }
  }, [boardId, isFetched, nonReactiveState])
}
