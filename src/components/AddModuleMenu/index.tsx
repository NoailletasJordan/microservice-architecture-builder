import selectedNodeContext from '@/selectedNodeContext'
import { Button, Menu, ThemeIcon } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useContext } from 'react'
import { useReactFlow } from 'reactflow'
import {
  ICON_STYLE,
  NO_DRAG_REACTFLOW_CLASS,
  TCustomNode,
} from '../../pages/BoardPage/components/Board/constants'
import { deepCopy } from '../../pages/BoardPage/helpers'
import { ModuleType, moduleConfig } from './moduleConstants'

interface Props {
  serviceId: string
}

export default function AddModuleMenu({ serviceId }: Props) {
  const { setServiceId: setSelectedServiceId, openSelectedNodeSection } =
    useContext(selectedNodeContext)
  const flowInstance = useReactFlow()
  const targettedService = flowInstance.getNode(serviceId) as TCustomNode

  const handleAddModule = (moduleType: ModuleType) => {
    const newModule = moduleConfig[moduleType].getNew(serviceId)
    const targettedServiceCopy = deepCopy(targettedService)
    targettedServiceCopy.data.modules.push(newModule)
    flowInstance.setNodes((nodes) =>
      nodes.map((compNode) =>
        compNode.id === serviceId ? targettedServiceCopy : compNode,
      ),
    )
    setSelectedServiceId(targettedService.id)
    openSelectedNodeSection()
  }

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
            const moduleAlreadyPresent = !!targettedService.data.modules.find(
              (compModule) => compModule.moduleType === moduleType,
            )
            return (
              <Menu.Item
                disabled={moduleAlreadyPresent || disabled}
                key={moduleType}
                onClick={() => handleAddModule(moduleType as ModuleType)}
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
