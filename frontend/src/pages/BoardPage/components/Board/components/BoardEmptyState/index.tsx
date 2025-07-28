import OnboardingMouseAreaIndicator from '@/components/OnboardingMouseAreaIndicator'
import { onBoardingContext } from '@/contexts/Onboarding/constants'
import { Box, Center, Space, Text, useMantineTheme } from '@mantine/core'
import { useContext } from 'react'
export default function BoardEmptyState() {
  const theme = useMantineTheme()
  const { showGuidanceTexts } = useContext(onBoardingContext)

  if (!showGuidanceTexts) return null
  return (
    <Box
      pos="absolute"
      top="50%"
      left="50%"
      style={{ transform: 'translate(-50%,-50%)' }}
    >
      <Center>
        <Center
          style={{
            width: 400,
            aspectRatio: '2/1',
          }}
        >
          <OnboardingMouseAreaIndicator text="Right click into the board to start" />
        </Center>
      </Center>
      <Space h="xl" />
      <Box ml="-1rem">
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
          <Text ff="Merienda, cursive" lts="1px" size="lg">
            Visualize and share software architectures in seconds !
          </Text>
        </Center>
      </Box>
    </Box>
  )
}
