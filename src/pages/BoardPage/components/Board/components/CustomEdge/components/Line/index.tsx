interface ILine {
  d: string
  stroke: string
  animated?: boolean
  // Use Exclude to exclude specific properties from the index signature
  [pathProps: string]: React.SVGProps<SVGPathElement> | any
}

export default function Line({ d, stroke, animated, ...pathProps }: ILine) {
  return (
    <path
      fill="none"
      stroke={stroke}
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
          to="20"
          dur="2s"
          repeatCount="indefinite"
        />
      )}
    </path>
  )
}
