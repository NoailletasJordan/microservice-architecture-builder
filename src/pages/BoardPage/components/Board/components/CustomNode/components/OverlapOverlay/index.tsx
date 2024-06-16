import { Flex, Overlay, Text, ThemeIcon } from '@mantine/core'
import { IconShare3 } from '@tabler/icons-react'

export default function OverlapOverlay() {
  return (
    <Overlay backgroundOpacity={0.45}>
      <Flex
        align="center"
        justify="center"
        gap="md"
        pos="absolute"
        top="50%"
        left="50%"
        bg="indigo.0"
        opacity={1}
        w="90%"
        p="xs"
        style={{
          transform: 'translate(-50%, -50%)',
          borderRadius: '4px',
        }}
      >
        <Text size="md">
          Integrate as an <br />
          <Text component="span" size="inherit" c="indigo" fw={700}>
            Internal service
          </Text>
        </Text>
        <ThemeIcon variant="transparent" color="gray">
          <IconShare3 />
        </ThemeIcon>
      </Flex>
    </Overlay>
  )
}
