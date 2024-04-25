import { Box, Image, Paper, Stack, Title } from '@mantine/core'
import { ReactNode } from 'react'

interface Props {
  imageUrl: ReactNode
  label: string
  handleClick: () => void
}

export default function Item({ imageUrl, label, handleClick }: Props) {
  return (
    <Paper
      onClick={handleClick}
      withBorder
      p="md"
      style={{ cursor: 'pointer' }}
    >
      <Stack align="center" gap="xs">
        <Box pos="relative">
          <Image w="4rem" src={imageUrl} />
          <Box pos="absolute" right="-.3rem" bottom="-1.0rem">
            <Image w="1.3rem" src="/board/plus-circle.svg" />
          </Box>
        </Box>
        <Title variant="fill" order={5}>
          {label}
        </Title>
      </Stack>
    </Paper>
  )
}
