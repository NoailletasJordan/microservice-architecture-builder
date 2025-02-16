import { CSSVAR } from '@/contants'
import { Box, Flex, Text } from '@mantine/core'
import { useMemo } from 'react'
import Delete from './components/Delete'

interface Props {
  parentId: string
}

export default function SubServicesHeader({ parentId }: Props) {
  const divider = useMemo(
    () => (
      <div
        style={{
          height: 1,
          width: '100%',
          backgroundColor: CSSVAR['--border'],
        }}
      />
    ),
    [],
  )

  return (
    <Flex align="center" gap="md">
      <Box
        style={{
          minHeight: 30,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <Text fw="600">Internal Services</Text>
        <Delete parentId={parentId} />
      </Box>
      {divider}
    </Flex>
  )
}
