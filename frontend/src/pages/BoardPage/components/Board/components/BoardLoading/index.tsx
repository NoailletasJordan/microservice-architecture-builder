import { CSSVAR } from '@/contants'
import { Center, Stack, Text } from '@mantine/core'
import { motion } from 'motion/react'

export function BoardLoading() {
  return (
    <Center h="100dvh">
      {loaderCSS}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: {
            ease: 'easeOut',
            duration: 0.15,
          },
        }}
      >
        <Stack align="center">
          <div
            style={{
              width: '100px',
              aspectRatio: '108 / 60',
            }}
            className="loader-board"
          />
          <Text>Fetching your data...</Text>
        </Stack>
      </motion.div>
    </Center>
  )
}

const loaderCSS = (
  <style>
    {`
    :root {
      --loader-color: ${CSSVAR['--primary']};
      --loader-width: 100%;
      --loader-height: 100%;
      --loader-gradient: radial-gradient(farthest-side, var(--loader-color) 96%, #0000);
    }
    .loader-board {
      width: var(--loader-width);
      height: var(--loader-height);
      color: var(--loader-color);
      background:
        var(--loader-gradient) 100% 100% / 30% 60%,
        var(--loader-gradient) 70%  0    / 50% 100%,
        var(--loader-gradient) 0    100% / 36% 68%,
        var(--loader-gradient) 27%  18%  / 26% 40%,
        linear-gradient(var(--loader-color) 0 0) bottom/67% 58%;
      background-repeat: no-repeat;
      position: relative;
      display: inline-block;
    }
    .loader-board:after {
      content: "";
      position: absolute;
      inset: 0;
      background: inherit;
      opacity: 0.4;
      animation: l7 1.2s infinite ease-in-out;
    }
    @keyframes l7 {
      to {
        transform: scale(1.8);
        opacity: 0;
      }
    }
   `}
  </style>
)
