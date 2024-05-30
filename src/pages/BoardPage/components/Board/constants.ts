import { Edge, Node } from 'reactflow'
import {
  TechnologiesKeys,
  TechnologiesValue,
  technologyAuthService,
  technologyDatabases,
  technologyEmailService,
  technologyFrontend,
  technologyPayment,
  technologyServer,
} from './components/CustomNode/components/TechnologieSelector/technologies-constant'

export interface Datatype {
  id: string
  serviceIdType: ServiceIdType
  technology?: TechnologiesKeys
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

export type DroppableType = 'delete' | 'board' | 'node' | 'toolbox'

type SUBSERVICE_KEY = 'subService'
type DASHBOARD_ITEM_KEY = 'dashboard-item'
type MODULE_KEY = 'module'
export type DraggableType = SUBSERVICE_KEY | DASHBOARD_ITEM_KEY | MODULE_KEY

export type DraggableData =
  | {
      draggableType: SUBSERVICE_KEY
      draggedContent: SubService
    }
  | {
      draggableType: DASHBOARD_ITEM_KEY
      draggedContent: Pick<Datatype, 'serviceIdType'>
    }
  | {
      draggableType: MODULE_KEY
      draggedContent: Module
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
  technologies: Record<string, TechnologiesValue>
}

export const serviceConfig: Record<ServiceIdType, ServiceConfigValue> = {
  frontend: {
    imageUrl: '/board/a-frontend.svg',
    label: 'Frontend',
    technologies: technologyFrontend,
  },
  'service-payment': {
    imageUrl: '/board/a-payment.svg',
    label: 'Payment',
    technologies: technologyPayment,
  },
  database: {
    imageUrl: '/board/a-database.svg',
    label: 'Database',
    technologies: technologyDatabases,
  },
  server: {
    imageUrl: '/board/a-server.svg',
    label: 'Server',
    technologies: technologyServer,
  },
  'service-email': {
    imageUrl: '/board/a-email.svg',
    label: 'Mailing',
    technologies: technologyEmailService,
  },
  authentification: {
    imageUrl: '/board/a-auth.svg',
    label: 'Auth',
    technologies: technologyAuthService,
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

export const CARD_WIDTH = 210
export const NO_DRAG_REACTFLOW_CLASS = 'noDragReactflow'
export const NO_WhEEL_REACTFLOW_CLASS = 'nowheel'
export const NO_PAN_REACTFLOW_CLASS = 'nopan'

export const ICON_STYLE = { height: '70%', width: '70%' }
