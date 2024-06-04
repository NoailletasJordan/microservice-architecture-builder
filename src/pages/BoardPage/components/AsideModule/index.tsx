import StrongText from '@/components/StrongText'
import Title from '@/components/Title'
import { selectedNodeContext } from '@/contexts/SelectedNode/constants'
import {
  ActionIcon,
  Box,
  Card,
  CloseButton,
  Divider,
  Group,
  Image,
  Stack,
  useMantineTheme,
} from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useContext, useEffect } from 'react'
import { useNodes, useReactFlow } from 'reactflow'
import {
  ICON_STYLE,
  IService,
  TCustomNode,
  serviceConfig,
} from '../../configs/constants'
import { handleDeleteNode } from '../../configs/helpers'
import DividerWrapper from '../Board/components/CustomNode/components/DividerWrapper/index'
import EditableTitle from '../Board/components/CustomNode/components/EditableTitle'
import { ServiceTool } from '../Board/components/Toolbar/components/ServiceTool'
import DirectLinks from './components/DirectConnexions/index'
import MainTechnologySection from './components/MainTechnologySection/index'
import NoServiceSelected from './components/NoServiceSelected'

const MODULE_SECTION_WIDTH_PX = 300

export default function AsideModules() {
  const flowInstance = useReactFlow()
  const nodes = useNodes<IService>()
  const {
    serviceId: selectedServiceId,
    setServiceId: setSelectedServiceId,
    toggleAsideOpen,
    asideIsOpened,
  } = useContext(selectedNodeContext)

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

  const theme = useMantineTheme()

  return (
    <Box
      h="100vh"
      w={MODULE_SECTION_WIDTH_PX}
      style={{
        transition: 'margin-right 300ms ease',
        boxShadow: '-12px 0px 5px rgba(0, 0, 0, 0.1)',
      }}
      mr={asideIsOpened ? 0 : -MODULE_SECTION_WIDTH_PX}
      p="md"
    >
      <Group justify="space-between" align="center" mb="md">
        <Title>Service Overview</Title>
        <CloseButton color="primary" size="sm" onClick={toggleAsideOpen} />
      </Group>
      <Divider orientation="horizontal" mb="sm" />

      {!selectedNode ? (
        <NoServiceSelected />
      ) : (
        <Stack>
          <Card bg={theme.colors[theme.primaryColor][1]} p="xs">
            <Box
              style={{
                display: 'grid',
                gap: '.5rem',
                gridTemplateColumns: 'max-content 1fr min-content',
                alignItems: 'center',
              }}
            >
              <Image
                h={40}
                w={40}
                src={serviceConfig[selectedNode.data.serviceIdType].imageUrl}
              />

              <EditableTitle service={selectedNode.data} />

              <Group justify="end">
                <ActionIcon
                  variant="light"
                  color="gray"
                  onClick={() =>
                    handleDeleteNode(selectedNode.data.id, flowInstance)
                  }
                >
                  <IconTrash style={ICON_STYLE} />
                </ActionIcon>
              </Group>
            </Box>
          </Card>
          <MainTechnologySection service={selectedNode.data} />

          {!!selectedNode.data.subServices.length && (
            <Box>
              <DividerWrapper>
                <StrongText>Internal Services</StrongText>
              </DividerWrapper>
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
        </Stack>
      )}
    </Box>
  )
}
