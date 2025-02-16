import Title from '@/components/Title'
import { themeDarkColorVariables } from '@/contants'
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
      transitionProps={{ transition: 'fade' }}
      centered
      size="lg"
      radius="md"
      styles={{
        root: { color: themeDarkColorVariables['--text'] },
        header: {
          background: themeDarkColorVariables['--surface'],
          borderBottom: `1px solid ${themeDarkColorVariables['--border']}`,
        },
        close: {
          color: themeDarkColorVariables['--text'],
        },
        content: {
          color: themeDarkColorVariables['--text'],
          background: themeDarkColorVariables['--surface'],
          border: `1px solid ${themeDarkColorVariables['--border']}`,
        },
      }}
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
      <Box p={PADDING} pb={0}>
        {children}
      </Box>
    </Modal>
  )
}
