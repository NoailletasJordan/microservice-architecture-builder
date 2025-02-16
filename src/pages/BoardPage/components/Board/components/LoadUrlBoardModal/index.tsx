import CustomModal from '@/components/CustomModal'
import {
  ICON_STYLE,
  TCustomNode,
  shareHashTocken,
} from '@/pages/BoardPage/configs/constants'
import { Button, Grid, Group, Space, Text, ThemeIcon } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconAlertTriangle, IconCheck, IconX } from '@tabler/icons-react'
import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getNodesBounds, useReactFlow } from 'reactflow'

interface Props {
  nodes: TCustomNode[]
}

// This components needs to be called after reactFlow initialisation
// because of "onClickOverwriteRef" function
// otherwise "fitBounds" / "fitView" etc simply doesnt work

export default function LoadLinkBoardModal({ nodes }: Props) {
  const [opened, modalAction] = useDisclosure(false)
  const maxSM = useMediaQuery('(max-width: 768px)')
  const location = useLocation()
  const { hash } = location
  const flowInstance = useReactFlow()
  const navigate = useNavigate()

  // Until useEffectEvent shipped
  // https://react.dev/reference/react/experimental_useEffectEvent
  const nodesRef = useRef<TCustomNode[]>([])
  const modalActionRef = useRef(modalAction)
  const onClickOverwriteRef = useRef<() => void>(() => null)

  nodesRef.current = nodes
  modalActionRef.current = modalAction
  onClickOverwriteRef.current = () => {
    try {
      const objectString = hash.replace(shareHashTocken, '')
      const loadedValues = JSON.parse(decodeURIComponent(objectString))
      flowInstance.setNodes(() => loadedValues.nodes)
      flowInstance.setEdges(() => loadedValues.edges)
      flowInstance.fitBounds(getNodesBounds(loadedValues.nodes))

      notifications.show({
        icon: (
          <ThemeIcon radius="xl" color="primary.10" variant="outline">
            <IconCheck style={ICON_STYLE} />
          </ThemeIcon>
        ),
        message: '',
        title: 'Board loaded successfully',
        autoClose: 6000,
      })
    } catch (error) {
      console.error(error)
      notifications.show({
        title: 'Error loading url content',
        message:
          'Continuing on existing content, apologies for the inconvenience',

        autoClose: 6000,
        icon: (
          <ThemeIcon radius="xl" variant="outline" color="pink">
            <IconX style={ICON_STYLE} />
          </ThemeIcon>
        ),
      })
    } finally {
      handleCloseModal()
    }
  }

  const handleCloseModal = () => {
    modalActionRef.current.close()
    navigate('/')
  }

  useEffect(() => {
    const isLoadExternalURL = hash.includes(shareHashTocken)
    if (!isLoadExternalURL) return modalActionRef.current.close()

    if (nodesRef.current.length) return modalActionRef.current.open()

    onClickOverwriteRef.current()
  }, [hash])

  return (
    <CustomModal
      fullScreen={maxSM}
      opened={opened}
      onClose={handleCloseModal}
      title="Warning: Load board from URL"
    >
      <Grid align="center" justify="center">
        <Grid.Col span="content">
          <ThemeIcon size="lg" variant="outline" color="pink">
            <IconAlertTriangle />
          </ThemeIcon>
        </Grid.Col>
        <Grid.Col span="auto">
          <Text size="md" miw="8rem">
            Loading external board{' '}
            <Text component="span" fw="bold">
              {' '}
              will overwrite your current work
            </Text>
            . Do you still you want to proceed?
          </Text>
        </Grid.Col>
      </Grid>
      <Space h="md" />
      <Group justify="end">
        <Button variant="outline" color="gray.11" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button color="red.9" onClick={onClickOverwriteRef.current}>
          Load external board
        </Button>
      </Group>
    </CustomModal>
  )
}
