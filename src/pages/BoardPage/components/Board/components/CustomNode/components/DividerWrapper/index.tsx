import { Divider, Grid } from '@mantine/core'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function DividerWrapper({ children }: Props) {
  return (
    <Grid align="center">
      <Grid.Col span="content">{children}</Grid.Col>
      <Grid.Col span="auto">
        <Divider my="md" bg="primary" />
      </Grid.Col>
    </Grid>
  )
}
