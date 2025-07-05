import { SubService, TCustomNode } from '@/pages/BoardPage/configs/constants'
import {
  getNodeOverlapping,
  getStateAfterDeleteNode,
} from '@/pages/BoardPage/configs/helpers'
import { NodeDragHandler, useReactFlow } from 'reactflow'

export function useOnNodeDragEnd() {
  const flowInstance = useReactFlow()

  const onNodeDragEnd: NodeDragHandler = (_event, node: TCustomNode) => {
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
