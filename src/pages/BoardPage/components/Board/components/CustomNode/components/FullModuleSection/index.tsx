import ModuleComponent from '@/components/ModuleComponent'
import { ScrollArea } from '@mantine/core'
import { NodeToolbar, Position } from 'reactflow'
import {
  IService,
  NO_DRAG_REACTFLOW_CLASS,
  NO_PAN_REACTFLOW_CLASS,
  NO_WhEEL_REACTFLOW_CLASS,
} from '../../../../constants'

interface Props {
  service: IService
  open: boolean
}

export default function FullModuleSection({ service, open }: Props) {
  return (
    <NodeToolbar
      onClick={(e) => e.stopPropagation()}
      nodeId={service.id}
      isVisible={open}
      position={Position.Bottom}
      className={`${NO_WhEEL_REACTFLOW_CLASS} ${NO_DRAG_REACTFLOW_CLASS} ${NO_PAN_REACTFLOW_CLASS}`}
    >
      {service.modules.map((module) => (
        <ScrollArea.Autosize offsetScrollbars mah={1000}>
          <ModuleComponent
            key={module.id}
            module={module}
            serviceId={service.id}
          />
        </ScrollArea.Autosize>
      ))}
    </NodeToolbar>
  )
}
