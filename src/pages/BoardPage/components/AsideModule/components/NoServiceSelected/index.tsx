import SubTitle from '@/components/SubTitle'
import { Center, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconBook } from '@tabler/icons-react'

export default function NoServiceSelected() {
  return (
    <Center h="100%">
      <Stack>
        <SubTitle ta="center">No service selected...</SubTitle>
        <Text ta="center" lh="1rem">
          Select a service by clicking the associated button (
          <Text component="span">
            <ThemeIcon
              style={{ transform: 'translateY(.4rem)' }}
              variant="transparent"
              color="primary"
              aria-label="Settings"
            >
              <IconBook stroke={1.5} />
            </ThemeIcon>
          </Text>
          )
        </Text>
      </Stack>
    </Center>
  )
}
