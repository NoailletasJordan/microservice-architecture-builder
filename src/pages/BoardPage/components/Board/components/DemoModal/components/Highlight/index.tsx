import { CSSVAR } from '@/contants'
import { Box } from '@mantine/core'
import { ReactNode } from 'react'

export default function Highlight({ children }: { children: ReactNode }) {
  return (
    <Box component="span" c={CSSVAR['--text-strong']}>
      {children}
    </Box>
  )
}
