import IconCustomGraphQ from '@/components/IconsCustom/IconCustomGraphQ'
import IconCustomHttp from '@/components/IconsCustom/IconCustomHttp'
import IconCustomKafka from '@/components/IconsCustom/IconCustomKafka'
import IconCustomRpc from '@/components/IconsCustom/IconCustomRpc'
import IconCustomWs from '@/components/IconsCustom/IconCustomWs'
import { Card, Divider, Group } from '@mantine/core'
import { Panel } from 'reactflow'
import DroppableArea from '../../../../../../components/DroppableArea/index'
import { ServiceIdType, serviceConfig } from '../../constants'
import CommunicationTool, {
  ConnexionConfig,
} from './components/CommunicationTool/index'
import { DraggableServiceTool } from './components/ServiceTool'

const connexionConfig: ConnexionConfig = {
  http: { Icon: IconCustomHttp, label: 'HTTP' },
  ws: { Icon: IconCustomWs, label: 'WebSockets' },
  grapql: { Icon: IconCustomGraphQ, label: 'GraphQL' },
  rpc: { Icon: IconCustomRpc, label: 'RPC' },
  kafka: { Icon: IconCustomKafka, label: 'Kaftka' },
}

export default function Builder() {
  const services = Object.entries(serviceConfig).map(([serviceIdType]) => (
    <DraggableServiceTool
      key={serviceIdType}
      serviceIdType={serviceIdType as ServiceIdType}
    />
  ))

  return (
    <Panel position="top-center">
      {/* catch drops before it falls on board, not doing anything with it tho */}
      <DroppableArea
        id="toolbox"
        data={{
          droppableType: 'toolbox',
        }}
      >
        <Card p="0.3rem" bg="white" shadow="md">
          <Group gap="0.3rem">
            {services}
            <Divider orientation="vertical" />
            <CommunicationTool connexionConfig={connexionConfig} />
          </Group>
        </Card>
      </DroppableArea>
    </Panel>
  )
}
