import Title from '@/components/Title'
import { Box, Modal } from '@mantine/core'
import { ReactNode } from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  children: ReactNode
  title: string
  fullScreen?: boolean
}

const PADDING = 'md'
export default function CustomModal({
  opened,
  onClose,
  title,
  children,
  fullScreen,
}: Props) {
  return (
    <Modal
      centered
      size="lg"
      opened={opened}
      fullScreen={fullScreen}
      onClose={onClose}
      overlayProps={{
        backgroundOpacity: 0.25,
      }}
      title={
        <Box px={PADDING}>
          <Title>{title}</Title>
        </Box>
      }
    >
      <Box p={PADDING}>{children}</Box>
    </Modal>
  )
}
