import ModuleComponent from '@/components/ModuleComponent'
import { Box, ScrollArea, Stack, Text } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { useRef } from 'react'
import AddModuleMenu from '../../../../../../components/AddModuleMenu/index'
import { IService, Module } from '../../../Board/constants'

interface Props {
  modules: Module[]
  serviceId: IService['id']
}

export default function Modules({ serviceId, modules }: Props) {
  const { height: viewportHeight } = useViewportSize()
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const { top: scrollableYposition } =
    scrollerRef?.current?.getBoundingClientRect?.() || {}
  const scrollableHeight = viewportHeight - Number(scrollableYposition)

  return (
    <Box>
      <Text>Modules</Text>

      <Stack>
        <AddModuleMenu serviceId={serviceId} />

        <div ref={scrollerRef}>
          <ScrollArea h={scrollableHeight}>
            <Stack>
              {modules.map((module) => (
                <ModuleComponent
                  key={module.id}
                  module={module}
                  serviceId={serviceId}
                />
              ))}
            </Stack>
          </ScrollArea>
        </div>
      </Stack>
    </Box>
  )
}
