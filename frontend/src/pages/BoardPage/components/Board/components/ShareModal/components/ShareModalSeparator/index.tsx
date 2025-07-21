import { Box, Divider, Grid, Space } from '@mantine/core'

export default function ShareModalSeparator() {
  return (
    <>
      <Space h="lg" />
      <Space h="xl" />
      <Grid align="center">
        <Grid.Col span="auto">
          <Divider />
        </Grid.Col>
        <Grid.Col span="content">
          <Box>OR</Box>
        </Grid.Col>
        <Grid.Col span="auto">
          <Divider />
        </Grid.Col>
      </Grid>
      <Space h="lg" />
      <Space h="xl" />
    </>
  )
}
