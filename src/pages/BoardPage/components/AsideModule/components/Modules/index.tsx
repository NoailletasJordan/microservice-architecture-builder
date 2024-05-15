import { deepCopy } from '@/pages/BoardPage/helpers'
import { ScrollArea, Stack } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { ReactNode, useRef } from 'react'
import { useReactFlow } from 'reactflow'
import { ModuleType } from '../../../Board/components/CustomNode/components/AddModuleMenu/moduleConstants'
import { Datatype, Module, TCustomNode } from '../../../Board/constants'
import ModuleEndpoints from './components/ModuleEndpoints'
import ModuleRichTextEditor from './components/ModuleRichTextEditor'

interface Props {
  modules: Module[]
  serviceId: Datatype['id']
}

const getComponents: Record<ModuleType, (props: any) => ReactNode> = {
  markdown: (props) => <ModuleRichTextEditor {...props} />,
  endpoints: (props) => <ModuleEndpoints {...props} />,
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
          {modules.map((module) => {
            const component = getComponents[module.moduleType]({
              key: module.id,
              module,
              updateModule: updateModule(module.id),
            })

            return component
          })}
        </Stack>
      </ScrollArea>
    </div>
  )
}
