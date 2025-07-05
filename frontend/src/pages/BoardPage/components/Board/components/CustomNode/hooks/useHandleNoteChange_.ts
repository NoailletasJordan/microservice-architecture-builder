import { getNodesAfterUpdateNode } from '@/pages/BoardPage/configs/helpers'
import { useReactFlow } from 'reactflow'

export function useHandleNoteChange_({ serviceId }: { serviceId: string }) {
  const flowInstance = useReactFlow()
  const handleNoteChange = (newNote: string) => {
    const currentNodes = flowInstance.getNodes()
    const nodeToEdit = flowInstance.getNode(serviceId)!
    nodeToEdit.data.note = newNote
    getNodesAfterUpdateNode({ currentNodes, newNode: nodeToEdit })
  }
  return handleNoteChange
}
