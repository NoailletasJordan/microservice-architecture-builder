import {
  ModuleType,
  moduleConfig,
} from '@/components/AddModuleMenu/moduleConstants'
import { ModuleIcon } from '@/pages/BoardPage/components/Board/components/CustomNode/components/ModuleIcon'
import {
  Datatype,
  ICON_STYLE,
  Module,
  TCustomNode,
} from '@/pages/BoardPage/components/Board/constants'
import { deepCopy, handleDeleteModule } from '@/pages/BoardPage/helpers'
import { Box, CloseButton, Flex, Group, Text } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { ReactNode } from 'react'
import { useReactFlow } from 'reactflow'
import ModuleEndpoints from './components/ModuleEndpoints'
import ModuleRichTextEditor from './components/ModuleRichTextEditor'

interface Props {
  module: Module
  serviceId: Datatype['id']
}

const getContentComponent: Record<ModuleType, (props: any) => ReactNode> = {
  markdown: (props) => <ModuleRichTextEditor {...props} />,
  endpoints: (props) => <ModuleEndpoints {...props} />,
}

export default function ModuleComponent({ module, serviceId }: Props) {
  const flowInstance = useReactFlow()

  const updateModuleWithId = (moduleId: string) => (newModule: Module) => {
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

  const moduleContent = getContentComponent[module.moduleType]({
    key: module.id,
    module,
    updateModule: updateModuleWithId(module.id),
  })

  return (
    <Box>
      <Flex>
        <Group
          pl="xs"
          gap="xs"
          style={{
            border: '1px solid var(--mantine-color-gray-4)',
            borderTopRightRadius: '4px',
            borderTopLeftRadius: '4px',
            borderBottom: '1px solid var(--mantine-color-white)',
            marginBottom: '-1px',
            zIndex: 1,
          }}
        >
          <ModuleIcon module={module} />

          <Text size="sm">{moduleConfig[module.moduleType].label}</Text>
          <CloseButton
            c="gray"
            icon={<IconTrash style={ICON_STYLE} />}
            onClick={() => handleDeleteModule(module.id, flowInstance)}
          />
        </Group>
      </Flex>
      {moduleContent}
    </Box>
  )
}
