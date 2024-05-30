import Title from '@/components/Title'
import {
  Box,
  Button,
  Card,
  CloseButton,
  Divider,
  Group,
  Image,
  Stack,
  Text,
} from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useContext, useEffect } from 'react'
import { useNodes, useReactFlow } from 'reactflow'
import selectedNodeContext from '../../../../selectedNodeContext'
import { handleDeleteNode } from '../../helpers'
import { ServiceTool } from '../Board/components/BuilderOptions/components/ServiceTool'
import {
  Datatype,
  ICON_STYLE,
  TCustomNode,
  serviceConfig,
} from '../Board/constants'
import DirectLinks from './components/DirectLinks/index'
import MainTechnologySection from './components/MainTechnologySection/index'
import ModulesSection from './components/ModulesSection'
import NoServiceSelected from './components/NoServiceSelected'

const MODULE_SECTION_WIDTH_PX = 300

interface Props {
  asideIsOpened: boolean
  toggleAsideIsOpened: () => void
}

export default function AsideModules({
  asideIsOpened,
  toggleAsideIsOpened,
}: Props) {
  const flowInstance = useReactFlow()
  const nodes = useNodes<Datatype>()
  const { serviceId: selectedServiceId, setServiceId: setSelectedServiceId } =
    useContext(selectedNodeContext)
  let selectedNode: TCustomNode | undefined
  if (selectedServiceId)
    selectedNode = nodes.find(({ id }) => id === selectedServiceId)

  // remove SelectedNode if node got removed
  useEffect(() => {
    if (!selectedServiceId) return
    const focusedServiceGotRemoved = !nodes.find(
      ({ id }) => id === selectedServiceId,
    )
    if (focusedServiceGotRemoved) setSelectedServiceId(null)
  }, [nodes, selectedServiceId, setSelectedServiceId])

  return (
    <Box
      h="100vh"
      w={MODULE_SECTION_WIDTH_PX}
      style={{
        transition: 'margin-right 300ms ease',
      }}
      mr={asideIsOpened ? 0 : -MODULE_SECTION_WIDTH_PX}
      p="md"
    >
      <Group justify="space-between" align="center" mb="md">
        <Title>Service Overview</Title>
        <CloseButton color="primary" size="sm" onClick={toggleAsideIsOpened} />
      </Group>
      <Divider orientation="horizontal" mb="sm" />

      {!selectedNode ? (
        <NoServiceSelected />
      ) : (
        <Stack>
          <Card bg="#ddd">
            <Group align="start" justify="space-between" mb="md">
              <Image
                h={70}
                w={70}
                src={serviceConfig[selectedNode.data.serviceIdType].imageUrl}
              />

              <Button
                leftSection={<IconTrash style={ICON_STYLE} />}
                variant="outline"
                color="red"
                size="xs"
                onClick={() =>
                  handleDeleteNode(selectedNode.data.id, flowInstance)
                }
              >
                Delete
              </Button>
            </Group>
          </Card>
          <MainTechnologySection service={selectedNode.data} />

          {!!selectedNode.data.subServices.length && (
            <Box>
              <Text size="xs">Internal Services</Text>
              <Group gap="xs">
                {selectedNode.data.subServices.map((subService) => (
                  <ServiceTool
                    key={subService.id}
                    serviceIdType={subService.serviceIdType}
                  />
                ))}
              </Group>
            </Box>
          )}

          <DirectLinks node={selectedNode} />

          <ModulesSection
            serviceId={selectedNode.id}
            modules={selectedNode.data.modules}
          />
        </Stack>
      )}
    </Box>
  )
}
