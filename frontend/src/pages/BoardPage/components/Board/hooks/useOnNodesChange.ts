import { OnNodesChange, applyNodeChanges } from 'reactflow'
import { useSetNodes } from './useSetNodes'

export function useOnNodesChange(): OnNodesChange {
  const setNodes = useSetNodes()

  return (changes) => setNodes((nds) => applyNodeChanges(changes, nds))
}
