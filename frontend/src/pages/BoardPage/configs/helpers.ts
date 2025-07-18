import { ReactFlowInstance, XYPosition } from '@xyflow/react'
import { v4 as uuidv4 } from 'uuid'
import { IConnexion } from '../components/Board/components/connexionContants'

import { TCustomEdge } from '../components/Board/components/connexionContants'
import {
  ILocalStorage,
  IService,
  serviceConfig,
  ServiceIdType,
  SubService,
  TCustomNode,
} from './constants'

export const getNewNode = ({
  serviceIdType,
  position,
  ...initialService
}: {
  serviceIdType: ServiceIdType
  position: XYPosition
} & Partial<IService>): TCustomNode => {
  const nodeID = initialService.id || uuidv4()
  return {
    id: nodeID,
    type: 'service',
    position,
    data: {
      id: nodeID,
      serviceIdType,
      title: serviceConfig[serviceIdType].defaultLabel,
      subServices: [],
      note: '',
      ...initialService,
    },
  }
}

export const storeInLocal = (boardId: string, data: ILocalStorage) => {
  localStorage.setItem(boardId as string, JSON.stringify(data))
}

export const getStateAfterDeleteNode = ({
  nodeId,
  currentEdges: oldEdges,
  currentNodes: oldNodes,
}: {
  nodeId: string
  currentNodes: TCustomNode[]
  currentEdges: TCustomEdge[]
}): { nodes: TCustomNode[]; edges: TCustomEdge[] } => {
  const newNodes = oldNodes.filter((compNode) => compNode.id != nodeId)
  const newEdges = oldEdges.filter(
    (edge) => edge.source !== nodeId && edge.target !== nodeId,
  )

  return { nodes: newNodes, edges: newEdges }
}

export const getNodesAfterDeleteSubservice = ({
  deleteId,
  oldNodes,
}: {
  deleteId: SubService['id']
  oldNodes: TCustomNode[]
}) => {
  const newNodes = oldNodes.map((compNode: TCustomNode) => {
    const filteredSubServices = compNode.data.subServices.filter(
      (compSubService) => compSubService.id != deleteId,
    )

    const newCompNode = structuredClone(compNode)
    newCompNode.data.subServices = filteredSubServices

    return newCompNode
  })

  return newNodes
}

export const getNodesAfterUpdateNode = ({
  newNode,
  currentNodes: oldNodes,
}: {
  newNode: TCustomNode
  currentNodes: TCustomNode[]
}): TCustomNode[] => {
  const result = oldNodes.map((compNode) =>
    compNode.id === newNode.id ? newNode : compNode,
  )
  return result
}

export const handleUpdateEdge = (
  connexionId: IConnexion['id'],
  partialEdge: Partial<IConnexion>,
  flowInstance: ReactFlowInstance<TCustomNode, TCustomEdge>,
) => {
  flowInstance.setEdges((edges) =>
    edges.map((compEdge) => {
      if (compEdge.id !== connexionId) return compEdge

      const edgeCopy = structuredClone(compEdge)

      edgeCopy.data = { ...edgeCopy.data, ...partialEdge } as IConnexion
      return edgeCopy
    }),
  )
}

export const getNodeOverlapping = (
  draggedNode: TCustomNode,
  nodes: TCustomNode[],
) => {
  const centerX =
    draggedNode.position.x + Number(draggedNode.measured?.width) * 0.5
  const centerY =
    draggedNode.position.y + Number(draggedNode.measured?.height) * 0.5

  const targetNode = nodes
    .filter((compNode) => compNode.id !== draggedNode.id)
    .find(
      (n) =>
        centerX > n.position.x &&
        centerX < n.position.x + Number(n.measured?.width) &&
        centerY > n.position.y &&
        centerY < n.position.y + Number(n.measured?.height),
    )

  return targetNode
}
