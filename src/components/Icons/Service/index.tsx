import { SVGProps } from 'react'

export default function Service({
  currentColor,
  ...svgProps
}: { currentColor: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      stroke={currentColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...svgProps}
    >
      <path
        d="M10.5713 12.1191H17.238"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <rect
        x="5.5"
        y="10.5"
        width="2"
        height="3"
        rx="0.5"
        fill={currentColor}
        stroke="none"
      />
      <rect x="3" y="8" width="18" height="8" rx="1" stroke-width="2" />
    </svg>
  )
}
