import { deepCopy } from '@/pages/BoardPage/helpers'
import { ScrollArea, Stack } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { useRef } from 'react'
import { useReactFlow } from 'reactflow'
import { Datatype, Module, TCustomNode } from '../../../Board/constants'
import ModuleRichTextEditor from './components/ModuleRichTextEditor'

interface Props {
  modules: Module[]
  serviceId: Datatype['id']
}

export default function Modules({ serviceId, modules }: Props) {
  const flowInstance = useReactFlow()
  const { height: viewportHeight } = useViewportSize()
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const { top: scrollableYposition } =
    scrollerRef?.current?.getBoundingClientRect?.() || {}
  const scrollableHeight = viewportHeight - Number(scrollableYposition)

  const updateModule = (moduleId: string) => (newModule: Module) => {
    flowInstance.setNodes((nodes: TCustomNode[]) =>
      nodes.map((compNode) => {
        if (compNode.id !== serviceId) return compNode
        const nodeCopy = deepCopy(compNode)
        const indexToSwap = nodeCopy.data.modules.findIndex(
          (module) => module.id === moduleId,
        )
        nodeCopy.data.modules.splice(indexToSwap, 1, newModule)
        return nodeCopy
      }),
    )
  }

  return (
    <div ref={scrollerRef}>
      <ScrollArea h={scrollableHeight}>
        <Stack p="md">
          {modules.map((module) => (
            <ModuleRichTextEditor
              key={module.id}
              module={module}
              updateModule={updateModule(module.id)}
            />
          ))}
        </Stack>
      </ScrollArea>
    </div>
  )
}
