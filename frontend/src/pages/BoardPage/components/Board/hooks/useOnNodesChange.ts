import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { OnNodesChange, applyNodeChanges } from '@xyflow/react'
import { useCallback } from 'react'
import { useSetNodes } from './useSetNodes'

export function useOnNodesChange(): OnNodesChange<TCustomNode> {
  const setNodes = useSetNodes()

  const onNodesChange: OnNodesChange<TCustomNode> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  )

  return onNodesChange
}
