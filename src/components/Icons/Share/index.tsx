import { SVGProps } from 'react'

export default function Share({
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
        d="M8.79487 5.74359H5.5C4.67157 5.74359 4 6.41516 4 7.24359V18.1923C4 19.0207 4.67157 19.6923 5.5 19.6923H19.0641C19.8925 19.6923 20.5641 19.0207 20.5641 18.1923V13.1538"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15.7692 11.6325V9.66667C11.7505 9.66667 10.3253 11.5191 9.44411 12.4915C9.37879 12.5636 9.26898 12.5075 9.28979 12.4125C9.86668 9.7775 12.4145 5.74359 15.7692 5.74359V4.18627C15.7692 4.1064 15.8582 4.05934 15.9246 4.10365L20.8885 7.41289C20.9441 7.44997 20.9484 7.53012 20.8971 7.57292L15.9332 11.7095C15.8681 11.7637 15.7692 11.7173 15.7692 11.6325Z"
        strokeWidth="1.8"
      />
    </svg>
  )
}
