import { TCustomEdge } from '@/pages/BoardPage/components/Board/components/connexionContants'
import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { getNodesAfterUpdateNode } from '@/pages/BoardPage/configs/helpers'
import { useReactFlow } from '@xyflow/react'

export function useHandleNoteChange_({ serviceId }: { serviceId: string }) {
  const flowInstance = useReactFlow<TCustomNode, TCustomEdge>()
  const handleNoteChange = (newNote: string) => {
    const currentNodes = flowInstance.getNodes()
    const nodeToEdit = flowInstance.getNode(serviceId)!
    nodeToEdit.data.note = newNote
    getNodesAfterUpdateNode({ currentNodes, newNode: nodeToEdit })
  }
  return handleNoteChange
}
