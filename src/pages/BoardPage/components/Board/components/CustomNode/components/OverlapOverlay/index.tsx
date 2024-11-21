import { Flex, Overlay, Text, ThemeIcon } from '@mantine/core'
import { IconShare3 } from '@tabler/icons-react'

export default function OverlapOverlay() {
  return (
    <Overlay backgroundOpacity={0.2}>
      <Flex
        align="center"
        justify="center"
        gap="md"
        pos="absolute"
        top="50%"
        left="50%"
        bg="background.7"
        opacity={1}
        w="90%"
        p="xs"
        style={{
          transform: 'translate(-50%, -50%)',
          borderRadius: '4px',
        }}
      >
        <Text size="md" c="primary.0" style={{ textAlign: 'center' }}>
          Integrate as an
          <br />
          <Text component="span" size="inherit" c="primary.0" fw={600}>
            internal service
          </Text>
          ?
        </Text>
        <ThemeIcon variant="transparent" color="text.0">
          <IconShare3 />
        </ThemeIcon>
      </Flex>
    </Overlay>
  )
}
