import {
  IService,
  Module,
  NO_DRAG_REACTFLOW_CLASS,
  NO_PAN_REACTFLOW_CLASS,
  NO_WhEEL_REACTFLOW_CLASS,
} from '@/pages/BoardPage/configs/constants'
import { handleAddModule } from '@/pages/BoardPage/configs/helpers'
import { Button, Text } from '@mantine/core'
import { IconNotes } from '@tabler/icons-react'
import { NodeToolbar, Position, useReactFlow } from 'reactflow'

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
        leftSection={<IconNotes />}
      >
        <Text component="span">Add a note</Text>
      </Button>
    </NodeToolbar>
  )
}
