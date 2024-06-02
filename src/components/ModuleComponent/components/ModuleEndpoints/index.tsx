import {
  ICON_STYLE,
  IModuleEndpoint,
} from '@/pages/BoardPage/components/Board/constants'
import { deepCopy } from '@/pages/BoardPage/helpers'
import { ActionIcon, Card, Center } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { v4 } from 'uuid'
import Endpoint from './components/Endoint'

interface Props {
  updateModule: (newModule: IModuleEndpoint) => void
  module: IModuleEndpoint
}

export default function ModuleEndpoints({ module, updateModule }: Props) {
  const handleNewEndpoint = () => {
    const newModule = deepCopy(module)
    newModule.data.endpoints.push({ address: '', method: 'GET' })
    updateModule(newModule)
  }

  return (
    <Card withBorder p="md">
      {module.data.endpoints.map((endpointData, index) => (
        <Card.Section key={v4()} withBorder p=".2rem">
          <Endpoint
            onClickDelete={() => {
              const newModule = deepCopy(module)
              newModule.data.endpoints = newModule.data.endpoints.filter(
                (_, i) => i !== index,
              )
              updateModule(newModule)
            }}
            endpointData={endpointData}
            onAdressChange={(event) => {
              const value = event.currentTarget.value
              const newModule = deepCopy(module)
              newModule.data.endpoints[index].address = value
              updateModule(newModule)
            }}
            onMethodChange={(newMethod) => {
              const newModule = deepCopy(module)
              newModule.data.endpoints[index].method = newMethod
              updateModule(newModule)
            }}
          />
        </Card.Section>
      ))}

      <Center pt="md">
        <ActionIcon
          onClick={handleNewEndpoint}
          variant="filled"
          radius="xl"
          aria-label="Settings"
        >
          <IconPlus style={ICON_STYLE} stroke={1.5} />
        </ActionIcon>
      </Center>
    </Card>
  )
}