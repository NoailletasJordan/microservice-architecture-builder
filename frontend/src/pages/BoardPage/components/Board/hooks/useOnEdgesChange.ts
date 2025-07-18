import { OnEdgesChange, applyEdgeChanges } from '@xyflow/react'
import { useCallback } from 'react'
import { TCustomEdge } from '../components/connexionContants'
import { useSetEdges } from './useSetEdges'

export function useOnEdgesChange(): OnEdgesChange<TCustomEdge> {
  const setEdges = useSetEdges()

  const onEdgesChange: OnEdgesChange<TCustomEdge> = useCallback(
    (changes: any) => setEdges((nds) => applyEdgeChanges(changes, nds)),
    [setEdges],
  )

  return onEdgesChange
}
