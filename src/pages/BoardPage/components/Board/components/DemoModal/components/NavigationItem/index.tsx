import { CSSVAR } from '@/contants'
import { Avatar, Box, Group } from '@mantine/core'

interface Props {
  title: string
  onClick: () => void
  active?: boolean
  Icon: ({
    currentColor,
    ...svgProps
  }: {
    currentColor: string
  } & React.SVGProps<SVGSVGElement>) => JSX.Element
}

export default function NavigationItem({
  onClick,
  title,
  active,
  Icon,
}: Props) {
  return (
    <Group
      onClick={onClick}
      px="sm"
      py="xs"
      style={{
        cursor: 'pointer',
      }}
      gap="xs"
      align="center"
    >
      <Box
        c={active ? CSSVAR['--text-strong'] : CSSVAR['--text']}
        style={{ transition: 'color 0.4s' }}
      >
        {title}
      </Box>
      <Avatar
        style={{ transition: 'background-color 0.4s' }}
        bg={active ? CSSVAR['--text-primary'] : CSSVAR['--surface-strong']}
        p={3}
      >
        <Icon
          strokeWidth={2}
          currentColor={active ? CSSVAR['--background'] : CSSVAR['--text']}
        />
      </Avatar>
    </Group>
  )
}
