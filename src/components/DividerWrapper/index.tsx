import { CSSVAR } from '@/contants'
import { Grid } from '@mantine/core'
import { motion } from 'motion/react'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function DividerWrapper({ children }: Props) {
  return (
    <Grid align="center">
      <Grid.Col span="content">{children}</Grid.Col>
      <Grid.Col span="auto">
        <motion.div
          animate={{ width: 'auto' }}
          layout="size"
          style={{
            height: 1,
            backgroundColor: CSSVAR['--border'],
          }}
        />
      </Grid.Col>
    </Grid>
  )
}
