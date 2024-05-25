import selectedNodeContext from '@/selectedNodeContext'
import { ActionIcon, Menu, ThemeIcon } from '@mantine/core'
import { IconCubePlus } from '@tabler/icons-react'
import { useContext } from 'react'
import { useReactFlow } from 'reactflow'
import { deepCopy } from '../../../../../../helpers'
import { NO_DRAG_REACTFLOW_CLASS, TCustomNode } from '../../../../constants'
import DividerWrapper from '../DividerWrapper/index'
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
      <DividerWrapper>
        <Menu.Target>
          <ActionIcon
            onClick={(event) => event.stopPropagation()}
            variant="filled"
            aria-label="Settings"
            size="sm"
            className={NO_DRAG_REACTFLOW_CLASS}
          >
            <IconCubePlus size="md" stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
      </DividerWrapper>
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
        })}
      </Menu.Dropdown>
    </Menu>
  )
}
