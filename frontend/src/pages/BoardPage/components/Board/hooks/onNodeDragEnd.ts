import { boardDataContext } from '@/contexts/BoardData/constants'
import { SubService, TCustomNode } from '@/pages/BoardPage/configs/constants'
import {
  getNodeOverlapped,
  getStateAfterDeleteNode,
} from '@/pages/BoardPage/configs/helpers'
import { omit } from 'lodash'
import { useContext } from 'react'
import { NodeDragHandler, useReactFlow } from 'reactflow'

export function useOnNodeDragEnd() {
  const flowInstance = useReactFlow()
  const { nodes } = useContext(boardDataContext)

  const onNodeDragEnd: NodeDragHandler = (_event, node: TCustomNode) => {
    const targetNode = getNodeOverlapped(node, nodes)
    if (!targetNode) return

    const currentEdges = flowInstance.getEdges()
    const currentNodes = flowInstance.getNodes()
    // Delete node and add it as a subService
    const { nodes: nodesAfterDelete, edges: edgesAfterDelete } =
      getStateAfterDeleteNode({ currentEdges, currentNodes, nodeId: node.id })
    const newSubService: SubService = {
      ...omit(node.data, 'subServices'),
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
