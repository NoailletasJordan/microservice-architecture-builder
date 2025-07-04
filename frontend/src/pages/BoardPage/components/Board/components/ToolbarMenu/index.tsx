import { Box } from '@mantine/core'

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
        {Array.from({ length: elements }).map((_, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: `${elementSize}px`,
              aspectRatio: '1',
              border: '1px solid blue',
              transformOrigin: '50% 50%',
              transform: `
                translate(
                  calc(${radius}px * cos(${
                ((index * angle - 180) * Math.PI) / 180
              }rad) + ${elementSize}px),
                  calc(${radius}px * sin(${
                ((index * angle - 180) * Math.PI) / 180
              }rad) + ${elementSize}px)
                )
              `,
            }}
          />
        ))}
      </Box>
    </div>
  )
}
