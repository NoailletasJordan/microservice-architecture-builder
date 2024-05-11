import { Edge, Node } from 'reactflow'
import { moduleConfig } from './components/CustomNode/components/AddModuleMenu/moduleConstants'

export interface Datatype {
  id: string
  serviceIdType: ServiceIdType
  subServices: SubService[]
  modules: Module[]
}

export interface Module {
  id: string
  moduleType: keyof typeof moduleConfig
  data: any
}

export type SubService = Omit<Datatype, 'subServices' | 'modules'> & {
  parentId: string
}

export type TCustomNode = Node<Datatype>

export type DroppableType = 'delete' | 'board' | 'node'

export type DraggableType = 'subService' | 'dashboard-item'

export type DraggableData<T = Datatype | SubService> = {
  draggableType: DraggableType
  node: T
}

export interface ILocalStorage {
  nodes: TCustomNode[]
  edges: Edge[]
  timestamp: Date
}

export type ServiceIdType = keyof typeof serviceConfig

export const serviceConfig = {
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
