import { ReactFlowInstance, XYPosition } from 'reactflow'
import { v4 as uuidv4 } from 'uuid'
import {
  ILocalStorage,
  IService,
  Module,
  ServiceIdType,
  SubService,
  TCustomNode,
  defaultEdges,
  defaultNodes,
  serviceConfig,
} from './components/Board/constants'

import {
  ModuleType,
  moduleConfig,
} from '@/components/AddModuleMenu/moduleConstants'
import { cloneDeep } from 'lodash'

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
      modules: [],
      ...initialService,
    },
  }
}

export const handleAddNode = (
  newNode: TCustomNode,
  flowInstance: ReactFlowInstance,
) => {
  flowInstance.setNodes((oldNodes: TCustomNode[]) => [...oldNodes, newNode])
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
  flowInstance.setEdges((oldEdges) =>
    oldEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
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

export const handleUpdateNode = (
  serviceId: string,
  newNode: TCustomNode,
  flowInstance: ReactFlowInstance,
): void => {
  flowInstance.setNodes((oldNodes) =>
    oldNodes.map((compNode) => {
      return compNode.id === serviceId ? cloneDeep(newNode) : compNode
    }),
  )
}

export const handleAddModule = (
  moduleType: ModuleType,
  nodeId: TCustomNode['id'],
  flowInstance: ReactFlowInstance,
) => {
  const node = flowInstance.getNode(nodeId) as TCustomNode
  const newModule = moduleConfig[moduleType].getNew(node.data.id)
  const targettedNodeCopy = cloneDeep(node)
  targettedNodeCopy.data.modules.push(newModule)
  handleUpdateNode(node.data.id, targettedNodeCopy, flowInstance)
}

export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))
