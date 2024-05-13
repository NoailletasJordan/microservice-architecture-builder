import { Box, Center, Flex, Image, Stack, Title } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react'
import { useContext, useEffect, useRef } from 'react'
import { useNodes } from 'reactflow'
import selectedNodeContext from '../../../../selectedNodeContext'
import { Datatype, TCustomNode, serviceConfig } from '../Board/constants'
import Modules from './components/Modules/index'
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

  const { height: viewportHeight } = useViewportSize()

  const asideRef = useRef<HTMLDivElement | null>(null)
  const { top: asideYposition } =
    asideRef?.current?.getBoundingClientRect?.() || {}
  const asideHeight = viewportHeight - Number(asideYposition)

  return (
    <div ref={asideRef}>
      <Flex
        style={{
          transition: 'margin-right 300ms ease',
        }}
        mr={asideIsOpened ? 0 : -MODULE_SECTION_WIDTH_PX}
      >
        <Center
          onClick={toggleAsideIsOpened}
          h={asideHeight}
          w="2rem"
          style={{
            border: '1px solid red',
          }}
          bg="#c4c4c4"
        >
          {asideIsOpened ? <IconChevronsRight /> : <IconChevronsLeft />}
        </Center>
        <Box h={asideHeight} w={MODULE_SECTION_WIDTH_PX}>
          {!selectedNode ? (
            <NoServiceSelected />
          ) : (
            <Stack>
              <Box>
                <Image
                  h={70}
                  w={70}
                  src={serviceConfig[selectedNode.data.serviceIdType].imageUrl}
                  alt="frontend"
                />
                <Title>
                  {serviceConfig[selectedNode.data.serviceIdType].label}
                </Title>
              </Box>

              <Modules
                serviceId={selectedNode.id}
                modules={selectedNode.data.modules}
              />
            </Stack>
          )}
        </Box>
      </Flex>
    </div>
  )
}
