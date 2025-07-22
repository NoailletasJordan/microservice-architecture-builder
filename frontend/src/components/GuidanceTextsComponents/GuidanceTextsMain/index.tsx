import { CSSVAR, customColors } from '@/contants'
import { Box, Center, Space, Text, useMantineTheme } from '@mantine/core'
import GuidanceText from '../GuidanceText'

export default function Main() {
  const theme = useMantineTheme()

  return (
    <Box
      pos="absolute"
      top="50%"
      left="50%"
      style={{ transform: 'translate(-50%,-50%)' }}
    >
      <Box ml="-1rem" bg="#222">
        <Box
          style={{
            margin: 'auto',
            border: `1px solid ${CSSVAR['--border']}`,
            maxWidth: '400px',
          }}
        >
          <Box
            style={{
              margin: 'auto',
              width: '80px',
              aspectRatio: '1/1',
              border: `1px solid ${customColors.primary[5]}`,
              maxWidth: '400px',
            }}
          ></Box>
        </Box>

        <Box
          style={{
            margin: 'auto',
            border: `1px solid ${CSSVAR['--border']}`,
            maxWidth: '400px',
          }}
        >
          Start by right clicking into the board
        </Box>

        <Text
          size="30px"
          fw={700}
          variant="gradient"
          gradient={{
            from: theme.colors[theme.primaryColor][9],
            to: theme.colors[theme.primaryColor][11],
            deg: 90,
          }}
          w="100vw"
          px="lg"
          ta="center"
        >
          Microservice Architecture Builder
        </Text>
        <Space h="lg" />
        <Center>
          <GuidanceText>
            Visualize and share software architectures in seconds !
          </GuidanceText>
        </Center>
      </Box>
    </Box>
  )
}
