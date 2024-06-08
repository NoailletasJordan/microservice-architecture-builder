import Title from '@/components/Title'
import {
  ICON_STYLE,
  ILocalStorage,
  STORAGE_DATA_INDEX_KEY,
  shareHashTocken,
} from '@/pages/BoardPage/configs/constants'
import {
  Box,
  Button,
  Grid,
  Modal,
  Text,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core'
import {
  readLocalStorageValue,
  useDisclosure,
  useLocalStorage,
  useMediaQuery,
} from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react'
import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useReactFlow } from 'reactflow'

const getHasNodesInLocalStorage = (): boolean => {
  const fromStorage = readLocalStorageValue<ILocalStorage | undefined>({
    key: STORAGE_DATA_INDEX_KEY,
  })
  return !!fromStorage?.nodes.length
}

export default function LoadExternalBoardHandler() {
  const [currentBoardData] = useLocalStorage<ILocalStorage>({
    key: STORAGE_DATA_INDEX_KEY,
  })
  const [opened, modalAction] = useDisclosure(false)
  const theme = useMantineTheme()
  const maxSM = useMediaQuery('(max-width: 768px)')
  const location = useLocation()
  const { hash } = location
  const flowInstance = useReactFlow()
  const navigate = useNavigate()

  const handleCloseModal = useCallback(() => {
    modalAction.close()
    navigate('/')
  }, [modalAction, navigate])

  const onClickOverwrite = useCallback(() => {
    try {
      const loadValue = hash.replace(shareHashTocken, '')
      const object = JSON.parse(decodeURIComponent(loadValue))
      flowInstance.setNodes(() => object.nodes)
      flowInstance.setEdges(() => object.edges)
      flowInstance.fitView()
      notifications.show({
        withBorder: true,
        icon: <IconCheck style={ICON_STYLE} />,
        message: (
          <Text fw={700} size="sm">
            Data loaded successfully
          </Text>
        ),
        color: 'green',
        autoClose: 7000,
      })
    } catch (error) {
      console.error(error)
      notifications.show({
        title: 'Error loading url content',
        message:
          'Continuing on existing content, apologies for the inconvenience',
        color: 'pink',
        autoClose: 6000,
        withBorder: true,
      })
    } finally {
      handleCloseModal()
    }
  }, [hash, flowInstance, handleCloseModal])

  useEffect(() => {
    const isLoadExternalURL = hash.includes(shareHashTocken)
    if (!isLoadExternalURL) return modalAction.close()

    const hasNodesInLocalStorage = getHasNodesInLocalStorage()
    if (hasNodesInLocalStorage) return modalAction.open()

    onClickOverwrite()
  }, [hash, modalAction, currentBoardData, onClickOverwrite])

  return (
    <Modal
      fullScreen={maxSM}
      centered
      opened={opened}
      onClose={handleCloseModal}
      title={<Title>Load from link</Title>}
      size="lg"
    >
      <Box bg="red.0" p="lg" style={{ borderRadius: theme.radius.md }}>
        <Grid align="center" justify="center">
          <Grid.Col span="content">
            <ThemeIcon size="lg" variant="transparent" color="pink">
              <IconAlertTriangle />
            </ThemeIcon>
          </Grid.Col>
          <Grid.Col span="auto">
            <Text size="md" c="red.9" miw="8rem">
              Loading an external board will replace your existing content.
            </Text>
          </Grid.Col>
          <Grid.Col span="content">
            <Button color="pink.6" c="dark" onClick={onClickOverwrite}>
              Replace my content
            </Button>
          </Grid.Col>
        </Grid>
      </Box>
    </Modal>
  )
}
