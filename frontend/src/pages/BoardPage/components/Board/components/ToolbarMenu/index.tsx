import { Box } from '@mantine/core'
import { motion } from 'motion/react'

interface ToolbarMenuProps {
  elements?: number
  elementSize?: number
}

export default function ToolbarMenu({
  elements = 6,
  elementSize = 70,
}: ToolbarMenuProps) {
  // Calculate the radius based on number of elements and element size
  const radius = Math.max(50, elementSize * 1.5)
  const containerSize = radius * 2
  const angle = 360 / elements

  return (
    <div
      style={{
        height: '100dvh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        style={{ border: '1px solid red' }}
        h={`${containerSize}px`}
        w={`${containerSize}px`}
        pos="relative"
      >
        {Array.from({ length: elements }).map((_, index) => {
          const targetX = ((index * angle - 180) * Math.PI) / 180
          const targetY = ((index * angle - 180) * Math.PI) / 180

          return (
            <motion.div
              key={index}
              initial={{
                x: containerSize / 2 - elementSize / 2,
                y: containerSize / 2 - elementSize / 2,
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                x: `calc(${radius}px * cos(${targetX}rad) + ${elementSize}px)`,
                y: `calc(${radius}px * sin(${targetY}rad) + ${elementSize}px)`,
                opacity: 1,
                scale: 1,
                transition: {
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                  delay: index * 0.1,
                },
              }}
              style={{
                position: 'absolute',
                width: `${elementSize}px`,
                aspectRatio: '1',
                border: '1px solid blue',
                transformOrigin: '50% 50%',
              }}
            />
          )
        })}
      </Box>
    </div>
  )
}
