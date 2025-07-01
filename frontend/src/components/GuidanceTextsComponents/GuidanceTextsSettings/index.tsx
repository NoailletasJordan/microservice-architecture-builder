import { Box } from '@mantine/core'
import GuidanceText from '../GuidanceText'

export default function GuidanceTextsSettings() {
  return (
    <Box pos="absolute" mt="lg" style={{ transform: 'translateX(15px) ' }}>
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'min-content 1fr',
          gap: 16,
        }}
      >
        <img width={40} src="/onBoarding/arrow-toolbar.svg" />
        <Box mt="xl">
          <GuidanceText size="md" w={150}>
            Board actions and Log in
          </GuidanceText>
        </Box>
      </Box>
    </Box>
  )
}
