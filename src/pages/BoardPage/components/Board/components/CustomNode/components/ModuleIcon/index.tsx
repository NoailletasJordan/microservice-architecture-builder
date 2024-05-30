import DraggableArea from '@/components/DraggableArea'
import { Center, ThemeIcon } from '@mantine/core'
import { moduleConfig } from '../../../../../../../../components/AddModuleMenu/moduleConstants'
import { DraggableData, Module } from '../../../../constants'

interface Props {
  module: Module
}

export function DraggableModuleIcon({ module }: Props) {
  const draggableProps: DraggableData = {
    draggableType: 'module',
    draggedContent: module,
  }

  return (
    <DraggableArea id={module.id} data={draggableProps}>
      <ModuleIcon module={module} />
    </DraggableArea>
  )
}

export function ModuleIcon({ module }: Props) {
  const icon = moduleConfig[module.moduleType].icon
  return (
    <Center>
      <ThemeIcon
        variant="filled"
        aria-label="Settings"
        size="sm"
        color="violet"
      >
        {icon}
      </ThemeIcon>
    </Center>
  )
}
