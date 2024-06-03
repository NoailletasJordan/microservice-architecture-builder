import { Button, Menu, ThemeIcon } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useReactFlow } from 'reactflow'
import {
  ICON_STYLE,
  NO_DRAG_REACTFLOW_CLASS,
  TCustomNode,
} from '../../pages/BoardPage/components/Board/constants'
import { handleAddModule } from '../../pages/BoardPage/helpers'
import { ModuleType, moduleConfig } from './moduleConstants'

interface Props {
  serviceId: string
}

export default function AddModuleMenu({ serviceId }: Props) {
  const flowInstance = useReactFlow()
  const currentNode = flowInstance.getNode(serviceId) as TCustomNode

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          leftSection={<IconPlus style={ICON_STYLE} />}
          fullWidth
          size="xs"
          variant="outline"
          radius="lg"
        >
          Add Module
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Module</Menu.Label>
        {Object.entries(moduleConfig).map(
          ([moduleType, { label, icon, disabled }]) => {
            const moduleAlreadyPresent = !!currentNode.data.modules.find(
              (compModule) => compModule.moduleType === moduleType,
            )
            return (
              <Menu.Item
                disabled={moduleAlreadyPresent || disabled}
                key={moduleType}
                onClick={() =>
                  handleAddModule(
                    moduleType as ModuleType,
                    serviceId,
                    flowInstance,
                  )
                }
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
          },
        )}
      </Menu.Dropdown>
    </Menu>
  )
}
