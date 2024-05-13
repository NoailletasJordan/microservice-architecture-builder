import DraggableArea from '@/components/DraggableArea'
import { Box, ThemeIcon } from '@mantine/core'
import { DraggableData, Module } from '../../../../constants'
import { moduleConfig } from '../AddModuleMenu/moduleConstants'

interface Props {
  module: Module
}

export function DraggableModuleComponent({ module }: Props) {
  const draggableProps: DraggableData = {
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
    <Box>
      <ThemeIcon
        variant="filled"
        aria-label="Settings"
        size="sm"
        color="violet"
      >
        {icon}
      </ThemeIcon>
    </Box>
  )
}
