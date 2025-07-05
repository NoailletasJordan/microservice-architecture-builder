import { useEffectEventP } from '@/contants'
import { useEffect, useState } from 'react'
import { useUpdateNodeInternals } from 'reactflow'

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
    }, 400)

    return () => {
      clearTimeout(timeout)
    }
  }, [nodeId, nonReactiveState])

  return {
    bodyLayoutId: layoutId,
    imageLayoutId: layoutIdImage,
    imageLayout: layoutIdImage ? ('position' as const) : false,
  }
}
