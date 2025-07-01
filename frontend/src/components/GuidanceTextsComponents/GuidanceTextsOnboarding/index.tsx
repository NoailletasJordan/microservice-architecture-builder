import { Box, Grid } from '@mantine/core'
import GuidanceText from '../GuidanceText'

export default function GuidanceTextsOnboarding() {
  return (
    <Box
      miw={200}
      style={{
        transform: 'translateX(7px)',
      }}
    >
      <Grid align="center">
        <Grid.Col span="auto">
          <GuidanceText size="md">Feeling lost ? Here's a</GuidanceText>
          <GuidanceText size="md">20 seconds's guide</GuidanceText>
        </Grid.Col>
        <Grid.Col span="content">
          <img src="/onBoarding/arrow-help.svg" width="70px" alt="arrowDown" />
        </Grid.Col>
      </Grid>
    </Box>
  )
}
