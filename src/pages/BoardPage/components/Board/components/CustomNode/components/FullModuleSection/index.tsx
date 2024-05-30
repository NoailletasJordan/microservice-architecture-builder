import ModuleComponent from '@/components/ModuleComponent'
import { Card, ScrollArea, SimpleGrid } from '@mantine/core'
import { NodeToolbar, Position } from 'reactflow'
import {
  Datatype,
  NO_DRAG_REACTFLOW_CLASS,
  NO_PAN_REACTFLOW_CLASS,
  NO_WhEEL_REACTFLOW_CLASS,
} from '../../../../constants'

interface Props {
  service: Datatype
  open: boolean
}

export default function FullModuleSection({ service, open }: Props) {
  return (
    <NodeToolbar
      onClick={(e) => e.stopPropagation()}
      nodeId={service.id}
      isVisible={open}
      position={Position.Bottom}
    >
      <Card
        withBorder
        className={`${NO_WhEEL_REACTFLOW_CLASS} ${NO_DRAG_REACTFLOW_CLASS} ${NO_PAN_REACTFLOW_CLASS}`}
      >
        <SimpleGrid cols={service.modules.length}>
          {service.modules.map((module) => (
            <ScrollArea.Autosize offsetScrollbars mah={200}>
              <ModuleComponent
                key={module.id}
                module={module}
                serviceId={service.id}
              />
            </ScrollArea.Autosize>
          ))}
        </SimpleGrid>
      </Card>
    </NodeToolbar>
  )
}
