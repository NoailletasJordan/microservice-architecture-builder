import { Card, Divider, Group } from '@mantine/core'
import { Panel } from 'reactflow'
import DroppableArea from '../../../../../../components/DroppableArea/index'
import { ServiceIdType, serviceConfig } from '../../constants'
import CommunicationTool from './components/CommunicationTool/index'
import { DraggableServiceTool } from './components/ServiceTool'

export default function Toolbar() {
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
            <CommunicationTool />
          </Group>
        </Card>
      </DroppableArea>
    </Panel>
  )
}
