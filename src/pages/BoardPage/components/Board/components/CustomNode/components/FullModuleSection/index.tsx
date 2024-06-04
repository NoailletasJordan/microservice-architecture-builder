import ModuleComponent from '@/components/ModuleComponent'
import {
  IService,
  NO_DRAG_REACTFLOW_CLASS,
  NO_PAN_REACTFLOW_CLASS,
  NO_WhEEL_REACTFLOW_CLASS,
} from '@/pages/BoardPage/configs/constants'
import { ScrollArea } from '@mantine/core'
import { NodeToolbar, Position } from 'reactflow'

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
        <ScrollArea.Autosize key={module.id} offsetScrollbars mah={1000}>
          <ModuleComponent key={module.id} module={module} />
        </ScrollArea.Autosize>
      ))}
    </NodeToolbar>
  )
}
