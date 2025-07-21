import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import {
  Button,
  Card,
  Grid,
  Group,
  Loader,
  Space,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { IconDownload, IconPhotoDown } from '@tabler/icons-react'
import { useDownloadImage_ } from './hooks/useDownloadImage'
import { useGetPreviewImage_ } from './hooks/useGetPreviewImage_'

interface Props {
  close: () => void
  isOpened: boolean
}

export default function SaveAsImage({ close, isOpened }: Props) {
  const image = useGetPreviewImage_({ isOpened })
  const downloadImage = useDownloadImage_()

  return (
    <>
      <Group justify="center" gap={4}>
        <ThemeIcon variant="transparent" color="dark.0" radius="xl" size="lg">
          <IconPhotoDown style={ICON_STYLE} />
        </ThemeIcon>
        <Title order={3}>Export Image</Title>
      </Group>
      <Space h="lg" />
      <Grid align="flex-end">
        <Grid.Col span={8}>
          <Card
            withBorder
            p="xs"
            radius="md"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              aspectRatio: '16 / 9',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundImage: `url(${image})`,
            }}
          >
            {!image && <Loader color="dark.0" type="dots" />}
          </Card>
        </Grid.Col>
        <Grid.Col span="auto">
          <Button
            fullWidth
            color="dark.0"
            variant="outline"
            size="lg"
            leftSection={<IconDownload />}
            onClick={() => {
              downloadImage()
              close()
            }}
          >
            PNG
          </Button>
        </Grid.Col>
      </Grid>
    </>
  )
}
