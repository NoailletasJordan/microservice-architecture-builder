import { Modal } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'

interface Props {
  opened: boolean
  close: () => void
}

const VIDEO_ASPECT_RATIO = 1740 / 800

function videoResponsiveSizes(parentWidth: number, parentHeight: number) {
  let childWidth = parentWidth
  let childHeight = parentWidth / VIDEO_ASPECT_RATIO

  if (childHeight > parentHeight) {
    childHeight = parentHeight
    childWidth = parentHeight * VIDEO_ASPECT_RATIO
  }

  return {
    width: childWidth,
    height: childHeight,
  }
}

export default function DemoModal({ opened, close }: Props) {
  const { height, width } = useViewportSize()
  const { height: y, width: x } = videoResponsiveSizes(
    width * 0.8,
    height * 0.8,
  )

  return (
    <Modal
      onClose={close}
      opened={opened}
      withCloseButton={false}
      centered
      size="auto"
      overlayProps={{
        backgroundOpacity: 0.25,
      }}
    >
      <video
        style={{
          width: x,
          height: y,
        }}
        controls
        width="100%"
        autoPlay
        muted
      >
        <source src="/demo.mp4" type="video/mp4" />
      </video>
    </Modal>
  )
}
