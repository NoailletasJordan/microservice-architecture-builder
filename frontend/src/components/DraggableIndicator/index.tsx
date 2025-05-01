import { CSSVAR } from '@/contants'
import { Box } from '@mantine/core'

export default function Indicator() {
  return (
    <Box
      style={{
        clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
        borderRadius: '3px',
      }}
      bg={CSSVAR['--text']}
      right={0}
      top={0}
      pos="absolute"
      h=".5rem"
      w=".5rem"
    />
  )
}
