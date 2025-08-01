import { themeDarkColorVariables } from '@/contants'
import { showNotificationSuccess } from '@/helpers-react'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import {
  Button,
  Grid,
  Group,
  Space,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { IconCopy, IconLink } from '@tabler/icons-react'
import { useLink_ } from './hooks/useLink_'

interface Props {
  opened: boolean
  close: () => void
}

export default function ShareableLink({ opened, close }: Props) {
  const theme = useMantineTheme()
  const clipboard = useClipboard({ timeout: 3000 })

  const link = useLink_({ opened })

  const handleClose = () => {
    clipboard.reset()
    close()
  }

  return (
    <>
      <Space h="lg" />
      <Group justify="center" gap={4}>
        <ThemeIcon variant="transparent" color="dark.0" radius="xl" size="lg">
          <IconLink style={ICON_STYLE} />
        </ThemeIcon>
        <Title order={3}>Shareable link</Title>
      </Group>
      <Space h="lg" />
      <Grid py="xs" align="center">
        <Grid.Col span={{ xs: 8 }}>
          <TextInput
            variant="unstyled"
            px="xs"
            py={3}
            data-testid="share-link-input"
            styles={{
              input: {
                color: themeDarkColorVariables['--text'],
              },
            }}
            style={{
              borderRadius: 4,
              fontSize: theme.fontSizes.xs,
              border: `1px solid ${themeDarkColorVariables['--border']}`,
            }}
            bg={themeDarkColorVariables['--surface-strong']}
            readOnly
            value={link}
            size="md"
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 4 }}>
          <Button
            onClick={() => {
              !clipboard.copied && clipboard.copy(link)
              showNotificationSuccess({
                message: 'Copied to clipboard',
                autoClose: 3000,
              })
              handleClose()
            }}
            fullWidth
            size="lg"
            color="dark.0"
            variant="outline"
            leftSection={<IconCopy />}
          >
            Copy link
          </Button>
        </Grid.Col>
      </Grid>
      <Text size="sm">
        *This link captures your work at this point in time.
      </Text>
    </>
  )
}
