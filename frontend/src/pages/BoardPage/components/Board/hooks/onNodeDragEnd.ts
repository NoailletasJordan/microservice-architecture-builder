import { boardDataContext } from '@/contexts/BoardData/constants'
import { SubService, TCustomNode } from '@/pages/BoardPage/configs/constants'
import {
  getNodeOverlapped,
  handleDeleteNode,
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

    // Delete node and add it as a subService
    handleDeleteNode(node.id, flowInstance)
    const newSubService: SubService = {
      ...omit(node.data, 'subServices'),
      parentId: targetNode.data.id,
    }
    targetNode.data.subServices = [
      ...targetNode.data.subServices,
      newSubService,
    ]

    flowInstance.setNodes((oldNodes) =>
      oldNodes.map((compNode) =>
        compNode.id === targetNode.id ? targetNode : compNode,
      ),
    )
  }
  return onNodeDragEnd
}
