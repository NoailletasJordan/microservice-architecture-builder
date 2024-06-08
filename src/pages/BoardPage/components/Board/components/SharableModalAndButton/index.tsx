import Title from '@/components/Title'
import {
  ICON_STYLE,
  shareHashTocken,
} from '@/pages/BoardPage/configs/constants'
import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Modal,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { useClipboard, useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconCheck, IconCopy, IconLink } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { ReactFlowInstance, useReactFlow } from 'reactflow'

const getLink = (flowInstance: ReactFlowInstance) => {
  const baseUrl = `${window.location.origin}`
  const stringifiedData = JSON.stringify({
    nodes: flowInstance.getNodes(),
    edges: flowInstance.getEdges(),
  })
  return `${baseUrl}/${shareHashTocken}${encodeURIComponent(stringifiedData)}`
}

export default function SharableModalAndButton() {
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()
  const maxXS = useMediaQuery('(max-width: 576px)')
  const clipboard = useClipboard({ timeout: 3000 })
  const maxMD = useMediaQuery('(max-width: 992px)')

  const [link, setLink] = useState('')
  const flowInstance = useReactFlow()

  useEffect(() => {
    const fullUrl = getLink(flowInstance)
    setLink(fullUrl)

    return () => {}
  }, [opened, flowInstance])

  const Sharebutton = maxMD ? (
    <Box>
      <ActionIcon size="lg" onClick={open}>
        <IconLink style={{ width: '50%', height: '50%' }} />
      </ActionIcon>
    </Box>
  ) : (
    <Button leftSection={<IconLink style={ICON_STYLE} />} onClick={open}>
      {!maxMD && ' Share'}
    </Button>
  )

  return (
    <Box>
      {Sharebutton}
      <Modal
        fullScreen={maxXS}
        centered
        opened={opened}
        onClose={() => {
          clipboard.reset()
          close()
        }}
        title={
          <Box px="md">
            <Title>Shareable link</Title>
          </Box>
        }
        size="lg"
      >
        <Box p="md" style={{ borderRadius: theme.radius.md }}>
          <Grid align="center">
            <Grid.Col span={{ xs: 8 }}>
              <Box
                style={{
                  border: '1px solid var(--mantine-color-gray-4)',
                  borderRadius: 4,
                }}
                p="sm"
                bg={theme.colors[theme.primaryColor][1]}
              >
                <Text truncate="end" size="md">
                  {link}
                </Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={{ xs: 4 }}>
              <Button
                onClick={() => !clipboard.copied && clipboard.copy(link)}
                fullWidth
                size="lg"
                leftSection={
                  clipboard.copied ? (
                    <IconCheck style={ICON_STYLE} />
                  ) : (
                    <IconCopy style={ICON_STYLE} />
                  )
                }
              >
                <Text component="span" size="sm">
                  {clipboard.copied ? 'Copied' : 'Copy link'}
                </Text>
              </Button>
            </Grid.Col>
          </Grid>
        </Box>
      </Modal>
    </Box>
  )
}
