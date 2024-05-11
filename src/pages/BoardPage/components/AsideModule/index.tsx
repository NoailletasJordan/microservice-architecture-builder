import {
  Box,
  Center,
  Flex,
  Image,
  ScrollArea,
  Stack,
  Title,
} from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react'
import { useContext, useEffect, useRef } from 'react'
import { useNodes } from 'reactflow'
import selectedNodeContext from '../../../../selectedNodeContext'
import { TCustomNode, serviceConfig } from '../Board/constants'
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
  const nodes = useNodes<TCustomNode>()
  const { node: selectedNode, setNode: setSelectedNode } =
    useContext(selectedNodeContext)

  // remove SelectedNode if node got removed
  useEffect(() => {
    if (!selectedNode) return
    const focusedServiceGotRemoved = !nodes.find(
      ({ id }) => id === selectedNode.data.id,
    )
    if (focusedServiceGotRemoved) setSelectedNode(null)
  }, [nodes, selectedNode, setSelectedNode])

  const { height: viewportHeight } = useViewportSize()

  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const { top: scrollableYposition } =
    scrollerRef?.current?.getBoundingClientRect?.() || {}
  const scrollableHeight = viewportHeight - Number(scrollableYposition)

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

              <div ref={scrollerRef}>
                <ScrollArea h={scrollableHeight}>
                  <Stack>
                    {selectedNode.data.modules.map((module) => (
                      <Center
                        key={module.id}
                        style={{
                          border: '1px solid red',
                        }}
                        p="lg"
                      >
                        <Box>Module </Box>
                      </Center>
                    ))}
                  </Stack>
                </ScrollArea>
              </div>
            </Stack>
          )}
        </Box>
      </Flex>
    </div>
  )
}
