import { ReactFlowInstance, XYPosition } from 'reactflow'
import { v4 as uuidv4 } from 'uuid'

import { cloneDeep } from 'lodash'
import {
  ILocalStorage,
  IService,
  Module,
  STORAGE_DATA_INDEX_KEY,
  ServiceIdType,
  SubService,
  TCustomNode,
  defaultEdges,
  defaultNodes,
  serviceConfig,
} from './constants'
import { ModuleType, moduleConfig } from './modules'

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

export const getInitialBoardData = (): ILocalStorage => {
  const storageReference: ILocalStorage | undefined =
    STORAGE_DATA_INDEX_KEY &&
    !!localStorage.getItem(STORAGE_DATA_INDEX_KEY) &&
    JSON.parse(localStorage.getItem(STORAGE_DATA_INDEX_KEY) as string)

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

      const newCompNode = cloneDeep(compNode)
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

      const newCompNode = cloneDeep(compNode)
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

export const handleUpdateModule = (
  moduleId: Module['id'],
  newModule: Module,
  flowInstance: ReactFlowInstance,
) => {
  const nodes = flowInstance.getNodes() as TCustomNode[]

  const nodeFromModule = nodes.find((node) => {
    return !!node.data.modules.find((compModule) => compModule.id === moduleId)
  })!

  nodeFromModule.data.modules = nodeFromModule.data.modules.map((compModule) =>
    compModule.id === moduleId ? newModule : compModule,
  )

  handleUpdateNode(nodeFromModule.id, nodeFromModule, flowInstance)
}
