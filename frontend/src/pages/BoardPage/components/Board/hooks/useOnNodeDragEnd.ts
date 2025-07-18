import { SubService, TCustomNode } from '@/pages/BoardPage/configs/constants'
import {
  getNodeOverlapping,
  getStateAfterDeleteNode,
} from '@/pages/BoardPage/configs/helpers'
import { OnNodeDrag, useReactFlow, useUpdateNodeInternals } from '@xyflow/react'
import { TCustomEdge } from '../components/connexionContants'

export function useOnNodeDragEnd() {
  const flowInstance = useReactFlow<TCustomNode, TCustomEdge>()
  const updateNodeInternals = useUpdateNodeInternals()

  const onNodeDragEnd: OnNodeDrag<TCustomNode> = (_event, node) => {
    updateNodeInternals(node.id)

    const targetNode = getNodeOverlapping(node, flowInstance.getNodes())
    if (!targetNode) return

    const currentEdges = flowInstance.getEdges()
    const currentNodes = flowInstance.getNodes()
    // Delete node and add it as a subService
    const { nodes: nodesAfterDelete, edges: edgesAfterDelete } =
      getStateAfterDeleteNode({ currentEdges, currentNodes, nodeId: node.id })

    const { subServices: _, ...nodeDataOmitSubServices } = node.data
    const newSubService: SubService = {
      ...nodeDataOmitSubServices,
      parentId: targetNode.data.id,
    }
    targetNode.data.subServices = [
      ...targetNode.data.subServices,
      newSubService,
    ]

    const newNodes = [...nodesAfterDelete, targetNode]
    const newEdges = [...edgesAfterDelete]

    flowInstance.setNodes(newNodes)
    flowInstance.setEdges(newEdges)
  }

  return onNodeDragEnd
}
