import { Box, useMantineTheme } from '@mantine/core'

export default function Indicator() {
  const theme = useMantineTheme()
  return (
    <Box
      style={{
        clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
        borderRadius: '3px',
      }}
      bg={theme.colors[theme.primaryColor][3]}
      right={0}
      top={0}
      pos="absolute"
      h=".5rem"
      w=".5rem"
    />
  )
}
