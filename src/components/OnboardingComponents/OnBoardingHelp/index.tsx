import { Box, Grid } from '@mantine/core'
import OnboardingText from '../OnBoardingText'

export default function Help() {
  return (
    <Box
      pos="absolute"
      miw={200}
      style={{
        transform: 'translate( calc(-100% + 40px),-100%)',
      }}
    >
      <Grid align="end">
        <Grid.Col span="auto">
          <OnboardingText>Here's a quick demo</OnboardingText>
        </Grid.Col>
        <Grid.Col span="content">
          <img src="/onBoarding/arrow-help.svg" width="70px" alt="" />
        </Grid.Col>
      </Grid>
    </Box>
  )
}
