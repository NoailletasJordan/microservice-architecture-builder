import { ThemeIcon } from '@mantine/core'
import DraggableArea from '../../../../../../components/DraggableArea'
import { DroppableData, Module } from '../../constants'
import { moduleConfig } from '../CustomNode/components/AddModuleMenu/moduleConstants'

interface Props {
  module: Module
}

export function DraggableModuleComponent({ module }: Props) {
  const draggableProps: DroppableData = {
    draggableType: 'module',
    node: module,
  }

  return (
    <DraggableArea id={module.id} data={draggableProps}>
      <ModuleComponent module={module} />
    </DraggableArea>
  )
}

export function ModuleComponent({ module }: Props) {
  const icon = moduleConfig[module.moduleType].icon
  return (
    <ThemeIcon variant="filled" aria-label="Settings" size="sm" color="violet">
      {icon}
    </ThemeIcon>
  )
}
