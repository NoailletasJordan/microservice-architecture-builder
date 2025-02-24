import { SVGProps } from 'react'

export default function Connexion({
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
      <path d="M3 15H4.63154C5.11091 15 5.49951 14.5523 5.49951 14V10C5.49951 9.44772 5.11091 9 4.63154 9H3" />
      <path d="M6 12H18" />
      <path d="M5.5 11.1667L5.81152 11.5256C5.89045 11.6166 5.93392 11.733 5.93392 11.8534V12.4799C5.93392 12.6004 5.89045 12.7167 5.81152 12.8077L5.5 13.1666" />
      <path d="M21.0002 15H19.3335C18.7812 15 18.3335 14.5523 18.3335 14V10C18.3335 9.44772 18.7812 9 19.3335 9H21.0002" />
    </svg>
  )
}
