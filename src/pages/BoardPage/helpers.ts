import { ReactFlowInstance, XYPosition } from 'reactflow'
import { v4 as uuidv4 } from 'uuid'
import { Module, ServiceIdType } from './components/Board/constants'

import {
  ILocalStorage,
  SubService,
  TCustomNode,
  defaultEdges,
  defaultNodes,
} from './components/Board/constants'

export const getNewNode = ({
  serviceIdType,
  position,
}: {
  serviceIdType: ServiceIdType
  position: XYPosition
}): TCustomNode => {
  const nodeID = uuidv4()
  return {
    id: nodeID,
    type: 'service',
    position,
    data: {
      id: nodeID,
      serviceIdType,
      subServices: [],
      modules: [],
    },
  }
}
export const addNewNode = (
  serviceIdType: ServiceIdType,
  flowInstance: ReactFlowInstance,
  position: XYPosition,
) => {
  flowInstance.setNodes((oldNodes: TCustomNode[]) => [
    ...oldNodes,
    getNewNode({ serviceIdType, position }),
  ])
}

export const getInitialBoardData = (boardId: string): ILocalStorage => {
  const storageReference: ILocalStorage | undefined =
    boardId &&
    !!localStorage.getItem(boardId) &&
    JSON.parse(localStorage.getItem(boardId) as string)

  if (!storageReference)
    return { timestamp: new Date(), nodes: defaultNodes, edges: defaultEdges }

  return {
    timestamp: new Date(storageReference.timestamp),
    nodes: storageReference.nodes,
    edges: storageReference.edges,
  }
}

export const storeInLocal = (boardId: string, data: ILocalStorage) => {
  localStorage.setItem(boardId as string, JSON.stringify(data))
}

export const handleDeleteNode = (
  nodeId: string,
  flowInstance: ReactFlowInstance,
) => {
  flowInstance.setNodes((oldNodes) =>
    oldNodes.filter((compNode) => compNode.id != nodeId),
  )
}

export const handleDeleteSubservice = (
  deleteId: SubService['id'],
  flowInstance: ReactFlowInstance,
) => {
  flowInstance.setNodes((oldNodes) =>
    oldNodes.map((compNode: TCustomNode) => {
      const filteredSubServices = compNode.data.subServices.filter(
        (compSubService) => compSubService.id != deleteId,
      )

      const newCompNode = deepCopy(compNode)
      newCompNode.data.subServices = filteredSubServices

      return newCompNode
    }),
  )
}

export const handleDeleteModule = (
  deleteId: Module['id'],
  flowInstance: ReactFlowInstance,
) => {
  flowInstance.setNodes((oldNodes) =>
    oldNodes.map((compNode: TCustomNode) => {
      const filteredModules = compNode.data.modules.filter(
        (compModule) => compModule.id != deleteId,
      )

      const newCompNode = deepCopy(compNode)
      newCompNode.data.modules = filteredModules

      return newCompNode
    }),
  )
}

export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))
