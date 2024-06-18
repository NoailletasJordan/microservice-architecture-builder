import CustomModal from '@/components/CustomModal'
import {
  ICON_STYLE,
  shareHashTocken,
} from '@/pages/BoardPage/configs/constants'
import { Button, Grid, Text, TextInput, useMantineTheme } from '@mantine/core'
import { useClipboard, useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { ReactFlowInstance, useReactFlow } from 'reactflow'

interface Props {
  opened: boolean
  close: () => void
}
const getLink = (flowInstance: ReactFlowInstance) => {
  const baseUrl = `${window.location.origin}`
  const stringifiedData = JSON.stringify({
    nodes: flowInstance.getNodes(),
    edges: flowInstance.getEdges(),
  })
  return `${baseUrl}/${shareHashTocken}${encodeURIComponent(stringifiedData)}`
}

export default function SharableModal({ close, opened }: Props) {
  const theme = useMantineTheme()
  const maxXS = useMediaQuery('(max-width: 576px)')
  const clipboard = useClipboard({ timeout: 3000 })

  const [link, setLink] = useState('')
  const flowInstance = useReactFlow()

  useEffect(() => {
    const fullUrl = getLink(flowInstance)
    setLink(fullUrl)

    return () => {}
  }, [opened, flowInstance])

  const handleClose = () => {
    clipboard.reset()
    close()
  }
  return (
    <CustomModal
      fullScreen={maxXS}
      opened={opened}
      onClose={handleClose}
      title="Shareable link"
    >
      <Grid align="center">
        <Grid.Col span={{ xs: 8 }}>
          <TextInput
            variant="unstyled"
            bg={theme.colors[theme.primaryColor][1]}
            px="xs"
            py={3}
            style={{
              border: '1px solid var(--mantine-color-gray-4)',
              borderRadius: 4,
              fontSize: theme.fontSizes.xs,
            }}
            readOnly
            value={link}
            size="md"
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 4 }}>
          <Button
            onClick={() => {
              !clipboard.copied && clipboard.copy(link)
              notifications.show({
                withBorder: true,
                icon: <IconCheck style={ICON_STYLE} />,
                message: (
                  <Text fw={700} size="sm">
                    Copied to clipboard
                  </Text>
                ),
                color: 'var(--mantine-primary-color-5)',
                autoClose: 3000,
              })
              handleClose()
            }}
            fullWidth
            size="lg"
            leftSection={<IconCopy style={ICON_STYLE} />}
          >
            <Text component="span" size="sm">
              Copy link
            </Text>
          </Button>
        </Grid.Col>
      </Grid>
    </CustomModal>
  )
}
