import { CSSVAR } from '@/contants'

interface ILine {
  d: string
  animated?: boolean
  // Use Exclude to exclude specific properties from the index signature
  [pathProps: string]: React.SVGProps<SVGPathElement> | any
}

export default function Line({
  d,
  animated,
  strokeWidth = 1,
  ...pathProps
}: ILine) {
  return (
    <path
      fill="none"
      stroke={CSSVAR['--primary']}
      d={d}
      strokeWidth={strokeWidth}
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
