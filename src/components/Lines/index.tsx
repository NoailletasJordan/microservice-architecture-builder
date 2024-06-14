import { useMantineTheme } from '@mantine/core'

interface ILine {
  d: string
  animated?: boolean
  // Use Exclude to exclude specific properties from the index signature
  [pathProps: string]: React.SVGProps<SVGPathElement> | any
}

export function FullLine({ path }: { path: string }) {
  return <Line d={path} strokeDasharray="" />
}

export function DashedLine({ path }: { path: string }) {
  return <Line d={path} animated />
}

export function PreviewLine({ path }: { path: string }) {
  return <Line d={path} strokeDasharray="3,8" />
}

function Line({ d, animated, ...pathProps }: ILine) {
  const theme = useMantineTheme()
  const strokeColor = theme.colors[theme.primaryColor][3]
  return (
    <path
      fill="none"
      stroke={strokeColor}
      d={d}
      strokeWidth="1"
      strokeDasharray="10,10"
      strokeDashoffset="0"
      {...pathProps}
    >
      {animated && (
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-20"
          dur="2s"
          repeatCount="indefinite"
        />
      )}
    </path>
  )
}
