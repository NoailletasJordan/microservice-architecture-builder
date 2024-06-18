import { Box } from '@mantine/core'
import OnboardingText from '../OnBoardingText'

export default function OnBoardingToolbar() {
  return (
    <Box pos="absolute" mt="lg" style={{ transform: 'translateX(-40%)' }}>
      <Box
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <OnboardingText miw={150}>
          Start dragging services into the board
        </OnboardingText>
        <img width={70} src="/onBoarding/arrow-toolbar.svg" />
      </Box>
    </Box>
  )
}
