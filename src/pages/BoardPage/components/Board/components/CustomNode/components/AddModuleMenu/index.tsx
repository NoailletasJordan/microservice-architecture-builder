import { ActionIcon, Box, Menu, ThemeIcon } from '@mantine/core'
import { IconCubePlus } from '@tabler/icons-react'
import { useReactFlow } from 'reactflow'
import { deepCopy } from '../../../../../../helpers'
import { NO_DRAG_REACTFLOW_CLASS, TCustomNode } from '../../../../constants'
import { ModuleType, moduleConfig } from './moduleConstants'

interface Props {
  serviceId: string
}

export default function AddModuleMenu({ serviceId }: Props) {
  const flowInstance = useReactFlow()
  const targettedService = flowInstance.getNode(serviceId) as TCustomNode

  const handleAddModule = (moduleType: ModuleType) => () => {
    const newModule = moduleConfig[moduleType].getNew(serviceId)
    const targettedServiceCopy = deepCopy(targettedService)
    targettedServiceCopy.data.modules.push(newModule)
    flowInstance.setNodes((nodes) =>
      nodes.map((compNode) =>
        compNode.id === serviceId ? targettedServiceCopy : compNode,
      ),
    )
  }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Box>
          <ActionIcon
            variant="filled"
            aria-label="Settings"
            size="sm"
            className={NO_DRAG_REACTFLOW_CLASS}
          >
            <IconCubePlus size="md" stroke={1.5} />
          </ActionIcon>
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Add a module</Menu.Label>
        {Object.entries(moduleConfig).map(([moduleType, { label, icon }]) => {
          const moduleAlreadyPresent = !!targettedService.data.modules.find(
            (compModule) => compModule.moduleType === moduleType,
          )
          return (
            <Menu.Item
              disabled={moduleAlreadyPresent}
              key={moduleType}
              onClick={handleAddModule(moduleType as ModuleType)}
              leftSection={
                <ThemeIcon
                  variant="filled"
                  aria-label="Settings"
                  size="sm"
                  className={NO_DRAG_REACTFLOW_CLASS}
                >
                  {icon}
                </ThemeIcon>
              }
            >
              {label}
            </Menu.Item>
          )
        })}
      </Menu.Dropdown>
    </Menu>
  )
}
