import { CSSVAR } from '@/contants'
import { Flex, Overlay, Text, ThemeIcon } from '@mantine/core'
import { IconShare3 } from '@tabler/icons-react'

export default function OverlapOverlay() {
  return (
    <Overlay backgroundOpacity={0.5}>
      <Flex
        align="center"
        justify="center"
        gap="md"
        pos="absolute"
        top="50%"
        left="50%"
        bg={CSSVAR['--surface']}
        opacity={1}
        w="90%"
        p="xs"
        style={{
          border: `1px solid ${CSSVAR['--border-strong']}`,
          transform: 'translate(-50%, -50%)',
          borderRadius: '4px',
        }}
      >
        <Text size="md" c={CSSVAR['--text-strong']}>
          Integrate as an
          <br />
          <Text
            component="span"
            c={CSSVAR['--text-primary']}
            size="inherit"
            fw={600}
          >
            internal service
          </Text>{' '}
          ?
        </Text>
        <ThemeIcon
          style={{
            border: 'none',
          }}
          variant="outline"
          color="gray.12"
        >
          <IconShare3 stroke={1} />
        </ThemeIcon>
      </Flex>
    </Overlay>
  )
}
