import { CSSVAR } from '@/contants'
import { Box, Text } from '@mantine/core'
import GuidanceText from '../GuidanceText'

export default function GuidanceToolbar() {
  return (
    <Box pos="absolute" mt="lg" style={{ transform: 'translateX(30px)' }}>
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'min-content 1fr',
          gap: 16,
        }}
      >
        <img width={40} src="/onBoarding/arrow-toolbar.svg" />
        <Box mt="xl">
          <GuidanceText w={150}>
            Start dragging{' '}
            <Text component="span" c={CSSVAR['--text-strong']}>
              services
            </Text>{' '}
            into the board
          </GuidanceText>
        </Box>
      </Box>
    </Box>
  )
}
