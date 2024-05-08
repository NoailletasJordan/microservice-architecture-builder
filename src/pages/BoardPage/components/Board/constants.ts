import { Edge, Node } from 'reactflow'

export interface Datatype {
  id: string
  imageUrl: string
  serviceIdType: ServiceIdType
  subServices: SubService[]
}

export type SubService = Omit<Datatype, 'subServices'> & {
  parentId: string
}

export type TCustomNode = Node<Datatype>

export type DroppableType = 'delete' | 'board' | 'node'

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
      imageUrl: '/board/a-auth.svg',
      serviceIdType: 'authentification',
      subServices: [
        {
          id: '3',
          parentId: '1',
          serviceIdType: 'service-email',
          imageUrl: serviceConfig['service-email'].imageUrl,
        },
      ],
    },
  },
  {
    id: '2',
    position: { x: 300, y: 50 },
    data: {
      id: '2',
      imageUrl: '/board/a-auth.svg',
      serviceIdType: 'database',
      subServices: [],
    },
    type: 'service',
  },
]

export const CARD_WIDTH = 230
