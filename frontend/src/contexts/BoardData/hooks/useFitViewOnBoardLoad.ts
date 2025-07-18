import { useEffectEventP } from '@/contants'
import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useReactFlow } from '@xyflow/react'
import { useEffect } from 'react'
import { useQueryKey } from './useQueryKey'

export default function useFitViewOnBoardLoad({
  isFetched,
}: {
  isFetched: boolean
}) {
  const [_, boardId] = useQueryKey()
  const FIT_VIEW_DURATION = 700
  const { fitView, getNodes } = useReactFlow<TCustomNode, TCustomEdge>()
  const nonReactiveState = useEffectEventP(() => ({
    fitView,
    getNodes,
  }))

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (isFetched) {
      const { fitView } = nonReactiveState()
      timeout = setTimeout(() => {
        const { getNodes } = nonReactiveState()
        if (getNodes().length === 0) return
        fitView({ duration: FIT_VIEW_DURATION, maxZoom: 1, minZoom: 0.65 })
      }, 0)
    }

    return () => {
      timeout && clearTimeout(timeout)
    }
  }, [boardId, isFetched, nonReactiveState])
}
