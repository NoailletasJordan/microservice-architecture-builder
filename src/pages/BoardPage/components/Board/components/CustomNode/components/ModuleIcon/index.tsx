import DraggableArea from '@/components/DraggableArea'
import DraggableIndicator from '@/components/DraggableIndicator'
import { DraggableData, Module } from '@/pages/BoardPage/configs/constants'
import { moduleConfig } from '@/pages/BoardPage/configs/modules'
import { Box, Center, ThemeIcon } from '@mantine/core'

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
  const Icon = moduleConfig[module.moduleType].Icon
  return (
    <Box pos="relative">
      <Center>
        <ThemeIcon size="lg" color="gray" variant="default">
          <Icon />
        </ThemeIcon>
        <DraggableIndicator />
      </Center>
    </Box>
  )
}
