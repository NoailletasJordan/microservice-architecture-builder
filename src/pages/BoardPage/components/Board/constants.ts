import { Edge, Node } from 'reactflow'

export interface Datatype {
  id: string
  serviceIdType: ServiceIdType
  subServices: SubService[]
  modules: Module[]
}

export interface IModuleRichText {
  id: string
  parentId: Datatype['id']
  moduleType: 'markdown'
  data: {
    text: string
  }
}

export interface IModuleEndpoint {
  id: string
  parentId: Datatype['id']
  moduleType: 'endpoints'
  data: IEndpointData
}

export type IEndpointData = {
  endpoints: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    address: string
  }[]
}

export type Module = IModuleRichText | IModuleEndpoint

export type SubService = Omit<Datatype, 'subServices' | 'modules'> & {
  parentId: Datatype['id']
}

export type TCustomNode = Node<Datatype>

export type DroppableType = 'delete' | 'board' | 'node'

type SUBSERVICE_KEY = 'subService'
type DASHBOARD_ITEM_KEY = 'dashboard-item'
type MODULE_KEY = 'module'
export type DraggableType = SUBSERVICE_KEY | DASHBOARD_ITEM_KEY | MODULE_KEY

export type DraggableData =
  | {
      draggableType: SUBSERVICE_KEY
      node: SubService
    }
  | {
      draggableType: DASHBOARD_ITEM_KEY
      node: Datatype
    }
  | {
      draggableType: MODULE_KEY
      node: Module
    }

export interface ILocalStorage {
  nodes: TCustomNode[]
  edges: Edge[]
  timestamp: Date
}

export type ServiceIdType =
  | 'authentification'
  | 'frontend'
  | 'service-payment'
  | 'database'
  | 'server'
  | 'service-email'

type ServiceConfigValue = {
  imageUrl: string
  label: string
}

export const serviceConfig: Record<ServiceIdType, ServiceConfigValue> = {
  frontend: {
    imageUrl: '/board/a-frontend.svg',
    label: 'Frontend',
  },
  'service-payment': {
    imageUrl: '/board/a-payment.svg',
    label: 'Payment service',
  },
  database: {
    imageUrl: '/board/a-database.svg',
    label: 'Database',
  },
  server: {
    imageUrl: '/board/a-server.svg',
    label: 'Server',
  },
  'service-email': {
    imageUrl: '/board/a-email.svg',
    label: 'Email-service',
  },
  authentification: {
    imageUrl: '/board/a-auth.svg',
    label: 'Authentification',
  },
}

export const defaultEdges: Edge[] = [
  {
    id: 'test',
    source: '1',
    target: '2',
    sourceHandle: 'r',
    targetHandle: 'l',
    type: 'custom',
  },
]

export const defaultNodes: TCustomNode[] = [
  {
    id: '1',
    position: { x: 0, y: 50 },
    type: 'service',
    data: {
      id: '1',
      serviceIdType: 'authentification',
      subServices: [
        {
          id: '3',
          parentId: '1',
          serviceIdType: 'service-email',
        },
      ],
      modules: [],
    },
  },
  {
    id: '2',
    position: { x: 300, y: 50 },
    data: {
      id: '2',
      serviceIdType: 'database',
      subServices: [],
      modules: [],
    },
    type: 'service',
  },
]

export const CARD_WIDTH = 230
export const NO_DRAG_REACTFLOW_CLASS = 'noDragReactflow'
