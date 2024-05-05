import { Edge, ReactFlowInstance } from 'reactflow'
import { v4 as uuidv4 } from 'uuid'
import { ServiceIdType, serviceConfig } from '../../../../utils'
import { TCustomNode } from './components/CustomNode'

interface ILocalStorage {
  nodes: TCustomNode[]
  edges: Edge[]
  timestamp: Date
}

export const addNewNode = (
  serviceIdType: ServiceIdType,
  setNodes: ReactFlowInstance['setNodes'],
) => {
  const getNewNode = (serviceIdType: ServiceIdType): TCustomNode => {
    const newNode: TCustomNode = {
      id: uuidv4(),
      type: 'service',
      position: { x: 10, y: 10 },
      data: {
        imageUrl: serviceConfig[serviceIdType].imageUrl,
        serviceIdType,
      },
    }

    return newNode
  }

  setNodes((oldNodes: TCustomNode[]) => [
    ...oldNodes,
    getNewNode(serviceIdType),
  ])
}

export const getInitialBoardData = (boardId: string): ILocalStorage => {
  const storageReference: ILocalStorage | undefined =
    boardId && JSON.parse(localStorage.getItem(boardId) || '')

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

const defaultEdges: Edge[] = [
  {
    id: 'test',
    source: '1',
    target: '2',
    sourceHandle: 'r',
    targetHandle: 'l',
    type: 'custom',
  },
]

const defaultNodes: TCustomNode[] = [
  {
    id: '1',
    position: { x: 0, y: 50 },
    type: 'service',
    data: { imageUrl: '/board/a-auth.svg', serviceIdType: 'authentification' },
  },
  {
    id: '2',
    position: { x: 300, y: 50 },
    data: { imageUrl: '/board/a-auth.svg', serviceIdType: 'database' },
    type: 'service',
  },
]
