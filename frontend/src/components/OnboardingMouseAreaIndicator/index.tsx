import { COLOR_ONBOARDING } from '@/contants'
import { Stack, Text } from '@mantine/core'
import { motion } from 'motion/react'

interface Props {
  text: string
  hideSquare?: boolean
}
export default function OnboardingMouseAreaIndicator({
  text,
  hideSquare,
}: Props) {
  return (
    <Stack align="center" w="100%">
      <motion.svg
        initial={{ opacity: 1 }}
        animate={{ opacity: hideSquare ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        width="100%"
        height="100%"
        viewBox="0 0 279 138"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="2"
          width="275"
          height="134"
          rx="8"
          stroke={COLOR_ONBOARDING}
          stroke-opacity="0.7"
          stroke-width="4"
          stroke-dasharray="12 12"
        />
        <path
          d="M123 70H156"
          stroke={COLOR_ONBOARDING}
          stroke-opacity="0.7"
          stroke-width="4"
          stroke-linecap="round"
        />
        <path
          d="M140 53V86"
          stroke={COLOR_ONBOARDING}
          stroke-opacity="0.7"
          stroke-width="4"
          stroke-linecap="round"
        />
        <path
          d="M259.911 40C259.911 45.6942 255.294 50.3105 249.6 50.3105C243.906 50.3105 239.29 45.6942 239.29 40V33.4434C239.32 33.4525 239.35 33.4632 239.381 33.4727C240.013 33.6633 240.909 33.9172 241.971 34.1709C244.089 34.6765 246.898 35.1895 249.6 35.1895C252.302 35.1895 255.112 34.6765 257.229 34.1709C258.291 33.9172 259.187 33.6633 259.819 33.4727C259.85 33.4632 259.881 33.4525 259.911 33.4434V40Z"
          stroke={COLOR_ONBOARDING}
          stroke-opacity="0.7"
          stroke-width="1.37931"
        />
        <path
          d="M250.79 17.1904C255.833 17.229 259.911 21.3298 259.911 26.3828V30.3945C259.911 30.4694 259.864 30.5366 259.793 30.5625L258.557 31.0176C256.648 31.721 254.666 32.2085 252.648 32.4717L251.14 32.6689C250.954 32.6931 250.79 32.5485 250.79 32.3613V29.3223C250.997 29.2428 251.225 29.1161 251.445 28.9121C252.086 28.3169 252.54 27.2095 252.54 25.25C252.54 23.2801 252.081 22.1428 251.479 21.498C251.247 21.2496 251.006 21.0892 250.79 20.9863V17.1904Z"
          stroke={COLOR_ONBOARDING}
          stroke-opacity="0.7"
          stroke-width="1.37931"
        />
        <path
          d="M248.411 17.1904C243.367 17.229 239.29 21.3298 239.29 26.3828V30.3945C239.29 30.4694 239.336 30.5366 239.407 30.5625L240.643 31.0176C242.552 31.721 244.535 32.2085 246.552 32.4717L248.06 32.6689C248.246 32.6931 248.411 32.5485 248.411 32.3613V29.3223C248.203 29.2428 247.975 29.1161 247.755 28.9121C247.114 28.3169 246.661 27.2095 246.661 25.25C246.661 23.2801 247.119 22.1428 247.721 21.498C247.953 21.2496 248.194 21.0892 248.411 20.9863V17.1904Z"
          stroke={COLOR_ONBOARDING}
          stroke-opacity="0.7"
          stroke-width="1.37931"
        />
        <rect
          x="248.6"
          y="22.5"
          width="2"
          height="5"
          rx="1"
          fill={COLOR_ONBOARDING}
          fill-opacity="0.7"
        />
        <path
          d="M258.1 16.75L258.204 16.8149C259.444 17.5899 260.446 18.6921 261.1 20V20"
          stroke={COLOR_ONBOARDING}
          stroke-opacity="0.7"
          stroke-width="1.37931"
          stroke-linecap="round"
        />
        <path
          d="M258.6 14L259.206 14.3843C260.99 15.5164 262.427 17.1182 263.361 19.0137L263.6 19.5"
          stroke={COLOR_ONBOARDING}
          stroke-opacity="0.7"
          stroke-width="1.37931"
          stroke-linecap="round"
        />
        <path
          d="M259.1 11L261.341 12.3788C263.145 13.4893 264.608 15.0767 265.567 16.9659L266.6 19"
          stroke={COLOR_ONBOARDING}
          stroke-opacity="0.7"
          stroke-width="1.37931"
          stroke-linecap="round"
        />
      </motion.svg>
      <Text fw="bold" c={COLOR_ONBOARDING}>
        {text}
      </Text>
    </Stack>
  )
}
