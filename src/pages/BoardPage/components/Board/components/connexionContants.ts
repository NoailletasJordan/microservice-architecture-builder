import IconCustomGraphQ from '@/components/IconsCustom/IconCustomGraphQL'
import IconCustomHttp from '@/components/IconsCustom/IconCustomHttp'
import IconCustomKafka from '@/components/IconsCustom/IconCustomKafka'
import IconCustomPSub from '@/components/IconsCustom/IconCustomPSub'
import IconCustomQueue from '@/components/IconsCustom/IconCustomQueue'
import IconCustomRpc from '@/components/IconsCustom/IconCustomRpc'
import IconCustomSSE from '@/components/IconsCustom/IconCustomSSE'
import IconCustomStream from '@/components/IconsCustom/IconCustomStream'
import IconCustomWebSocket from '@/components/IconsCustom/IconCustomWebSocket'
import { Edge } from 'reactflow'
export type IConnexionType =
  | 'http'
  | 'ws'
  | 'rpc'
  | 'kafka'
  | 'graphqlHttp'
  | 'sse'
  | 'graphqlSub'
  | 'queue'
  | 'pubsub'
  | 'stream'

type TConnectionGroup =
  | 'HTTP-Based'
  | 'Real-Time Connections'
  | 'Remote Procedure Calls'
  | 'Messaging Systems'
  | 'Event Streaming'

export type TCustomEdge = Edge<IConnexion>

export interface IConnexion {
  id: string
  connexionType: IConnexionType
  direction: (typeof connexionDirections)[number]
  note: string
}

export type ConnexionConfig = Record<
  IConnexionType,
  {
    label: string
    Icon: JSX.ElementType
    group: TConnectionGroup
    value: IConnexionType
  }
>

export const connexionDirections = ['duplex', 'forward', 'reverse'] as const

export const connexionConfig: ConnexionConfig = {
  http: {
    group: 'HTTP-Based',
    value: 'http',
    Icon: IconCustomHttp,
    label: 'HTTP',
  },
  graphqlHttp: {
    group: 'HTTP-Based',
    value: 'graphqlHttp',
    Icon: IconCustomGraphQ,
    label: 'GraphQL',
  },
  sse: {
    group: 'HTTP-Based',
    value: 'sse',
    Icon: IconCustomSSE,
    label: 'Server-Sent Events',
  },
  ws: {
    group: 'Real-Time Connections',
    value: 'ws',
    Icon: IconCustomWebSocket,
    label: 'WebSockets',
  },
  graphqlSub: {
    group: 'Real-Time Connections',
    value: 'graphqlSub',
    Icon: IconCustomGraphQ,
    label: 'GraphQL Subscriptions',
  },
  rpc: {
    group: 'Remote Procedure Calls',
    value: 'rpc',
    Icon: IconCustomRpc,
    label: 'RPC',
  },
  queue: {
    group: 'Messaging Systems',
    value: 'queue',
    Icon: IconCustomQueue,
    label: 'Message Queues',
  },
  pubsub: {
    group: 'Messaging Systems',
    value: 'pubsub',
    Icon: IconCustomPSub,
    label: 'Pub/Sub',
  },
  stream: {
    group: 'Event Streaming',
    value: 'stream',
    Icon: IconCustomStream,
    label: 'Stream',
  },
  kafka: {
    group: 'Event Streaming',
    value: 'kafka',
    Icon: IconCustomKafka,
    label: 'Kafka',
  },
}
