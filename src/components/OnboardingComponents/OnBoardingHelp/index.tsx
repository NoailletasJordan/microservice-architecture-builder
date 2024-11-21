import { Box, Grid } from '@mantine/core'
import OnboardingText from '../OnBoardingText'

export default function Help() {
  return (
    <Box
      miw={200}
      style={{
        transform: 'translateX(7px)',
      }}
    >
      <Grid align="center">
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
