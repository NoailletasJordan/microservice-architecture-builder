import { useEffectEventP } from '@/contants'
import { useUpdateNodeInternals } from '@xyflow/react'
import { useEffect, useState } from 'react'

export function useLayoutIds_({ nodeId }: { nodeId: string }) {
  const [layoutId, setLayoutId] = useState<string | undefined>(nodeId)
  const layoutIdImage = layoutId ? `${layoutId}-icon` : undefined
  const updateNodeInternals = useUpdateNodeInternals()

  const nonReactiveState = useEffectEventP(() => ({ updateNodeInternals }))
  useEffect(() => {
    const timeout = setTimeout(() => {
      const { updateNodeInternals } = nonReactiveState()
      updateNodeInternals(nodeId)
      setLayoutId(undefined)
    }, 300)

    return () => {
      clearTimeout(timeout)
    }
  }, [nodeId, nonReactiveState])

  return {
    bodyLayoutId: layoutId,
    imageLayoutId: layoutIdImage,
    imageLayout: layoutIdImage ? true : false,
  }
}
