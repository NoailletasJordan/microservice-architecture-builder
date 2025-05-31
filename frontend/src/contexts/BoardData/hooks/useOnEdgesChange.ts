import { OnEdgesChange, applyEdgeChanges } from 'reactflow'
import { useSetEdges } from './useSetEdges'

export function useOnEdgesChange(): OnEdgesChange {
  const setEdges = useSetEdges()

  return (changes) => setEdges((nds) => applyEdgeChanges(changes, nds))
}
