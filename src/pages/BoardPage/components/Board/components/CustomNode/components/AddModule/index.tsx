import { handleAddModule } from '@/pages/BoardPage/helpers'
import { Button, Text } from '@mantine/core'
import { IconNote } from '@tabler/icons-react'
import { NodeToolbar, Position, useReactFlow } from 'reactflow'
import {
  IService,
  Module,
  NO_DRAG_REACTFLOW_CLASS,
  NO_PAN_REACTFLOW_CLASS,
  NO_WhEEL_REACTFLOW_CLASS,
} from '../../../../constants'

interface Props {
  serviceId: IService['id'] | null
  serviceIsSelected: boolean
  modules: Module[]
}

export default function AddModule({
  serviceId,
  serviceIsSelected,
  modules,
}: Props) {
  const flowInstance = useReactFlow()

  return (
    <NodeToolbar
      position={Position.Bottom}
      className={`${NO_WhEEL_REACTFLOW_CLASS} ${NO_DRAG_REACTFLOW_CLASS} ${NO_PAN_REACTFLOW_CLASS}`}
      isVisible={serviceIsSelected && !modules.length}
    >
      <Button
        onClick={() =>
          serviceId && handleAddModule('markdown', serviceId, flowInstance)
        }
        variant="subtle"
        size="compact-sm"
        leftSection={<IconNote />}
      >
        <Text component="span">Add a note</Text>
      </Button>
    </NodeToolbar>
  )
}
