import { Node } from 'reactflow'
import { TCustomEdge } from '../components/Board/components/connexionContants'

export interface IService {
  id: string
  serviceIdType: ServiceIdType
  title: string
  subServices: SubService[]
  note: string
}

export type SubService = Omit<IService, 'subServices'> & {
  parentId: IService['id']
}

export type TCustomNode = Node<IService>

export type DroppableType = 'delete' | 'board' | 'node' | 'toolbox'

type SUBSERVICE_KEY = 'subService'
type DASHBOARD_ITEM_KEY = 'dashboard-item'
export type DraggableType = SUBSERVICE_KEY | DASHBOARD_ITEM_KEY

export type DraggableData =
  | {
      draggableType: SUBSERVICE_KEY
      draggedContent: SubService
    }
  | {
      draggableType: DASHBOARD_ITEM_KEY
      draggedContent: Pick<IService, 'serviceIdType'>
    }

export interface ILocalStorage {
  nodes: TCustomNode[]
  edges: TCustomEdge[]
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
  defaultLabel: string
}

export const serviceConfig: Record<ServiceIdType, ServiceConfigValue> = {
  frontend: {
    imageUrl: '/board/a-frontend.svg',
    defaultLabel: 'Frontend',
  },
  server: {
    imageUrl: '/board/a-server.svg',
    defaultLabel: 'Server',
  },
  database: {
    imageUrl: '/board/a-database.svg',
    defaultLabel: 'Database',
  },
  authentification: {
    imageUrl: '/board/a-auth.svg',
    defaultLabel: 'Auth',
  },
  'service-email': {
    imageUrl: '/board/a-email.svg',
    defaultLabel: 'Mailing',
  },
  'service-payment': {
    imageUrl: '/board/a-payment.svg',
    defaultLabel: 'Payment',
  },
}

export const defaultEdges: TCustomEdge[] = [
  {
    id: '123',
    source: '1',
    target: '2',
    sourceHandle: 'r',
    targetHandle: 'l',
    type: 'custom',
    data: {
      id: '123',
      connexionType: 'http',
      direction: 'duplex',
      note: '',
    },
  },
]

export const defaultNodes: TCustomNode[] = [
  {
    id: '1',
    position: { x: 0, y: 50 },
    type: 'service',
    data: {
      id: '1',
      serviceIdType: 'frontend',
      title: serviceConfig['frontend'].defaultLabel,
      subServices: [],
      note: '',
    },
  },
  {
    id: '2',
    position: { x: 300, y: 50 },
    data: {
      id: '2',
      serviceIdType: 'server',
      title: serviceConfig['server'].defaultLabel,
      subServices: [],
      note: '',
    },
    type: 'service',
  },
]

export const shareHashTocken = '#json='
export const STORAGE_DATA_INDEX_KEY = 'board-data-index'
export const CARD_WIDTH = 210
export const NO_DRAG_REACTFLOW_CLASS = 'noDragReactflow'
export const NO_WhEEL_REACTFLOW_CLASS = 'nowheel'
export const NO_PAN_REACTFLOW_CLASS = 'nopan'

export const ICON_STYLE = { height: '70%', width: '70%' }
