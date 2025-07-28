import { onBoardingContext } from '@/contexts/Onboarding/constants'
import { Box, Button, Group, Stack } from '@mantine/core'
import { useContext } from 'react'

export default function Step3() {
  const { terminateOnboarding } = useContext(onBoardingContext)

  return (
    <Stack>
      <Box>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
      </Box>
      <Group justify="flex-end">
        <Button onClick={terminateOnboarding}>Got it !</Button>
      </Group>
    </Stack>
  )
}
