import Title from '@/components/Title'
import { themeDarkColorVariables } from '@/contants'
import { Box, Modal, ModalProps } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { ReactNode } from 'react'

interface Props extends ModalProps {
  opened: boolean
  onClose: () => void
  children: ReactNode
  title: string
}

const PADDING = 'md'
export default function CustomModal({
  opened,
  onClose,
  title,
  children,
  ...props
}: Props) {
  const maxSM = useMediaQuery('(max-width: 768px)')
  return (
    <Modal
      fullScreen={maxSM}
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
      onClose={onClose}
      overlayProps={{
        backgroundOpacity: 0.25,
      }}
      title={
        <Box px={PADDING}>
          <Title>{title}</Title>
        </Box>
      }
      {...props}
    >
      <Box p={PADDING} pb={0}>
        {children}
      </Box>
    </Modal>
  )
}
