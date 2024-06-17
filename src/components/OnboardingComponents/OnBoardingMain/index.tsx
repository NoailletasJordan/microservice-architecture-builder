import { Box, Center, Space, Text, useMantineTheme } from '@mantine/core'
import OnboardingText from '../OnBoardingText'

export default function Main() {
  const theme = useMantineTheme()

  return (
    <Box
      pos="absolute"
      top="50%"
      left="50%"
      style={{ transform: 'translate(-50%,-50%)' }}
    >
      <Box ml="-1rem">
        <Text
          size="30px"
          fw={700}
          variant="gradient"
          gradient={{
            from: theme.colors[theme.primaryColor][4],
            to: theme.colors[theme.primaryColor][6],
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
          <OnboardingText>
            All your data is saved locally in your browser
          </OnboardingText>
        </Center>
      </Box>
    </Box>
  )
}
