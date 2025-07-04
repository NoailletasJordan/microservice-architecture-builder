import { CSSVAR } from '@/contants'
import {
  CARD_HEIGHT_DEFAULT,
  CARD_WIDTH,
  serviceConfig,
  ServiceIdType,
} from '@/pages/BoardPage/configs/constants'
import { getNewNode } from '@/pages/BoardPage/configs/helpers'
import { Box, Image } from '@mantine/core'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useReactFlow } from 'reactflow'

const elementSize = 80

export default (function ToolbarMenu() {
  // Calculate the radius based on number of elements and element size
  const elementsNumber = Object.entries(serviceConfig).length
  const radius = Math.max(50, elementSize * 1.5)
  const containerSize = radius * 2
  const angle = 360 / elementsNumber

  const [activated, setActivated] = useState<ServiceIdType | null>(null)

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
      {/* <LayoutGroup> */}
      <Box h={`${containerSize}px`} w={`${containerSize}px`} pos="relative">
        {Object.entries(serviceConfig).map(([serviceIdType], index) => {
          const targetX = ((index * angle - 90) * Math.PI) / 180
          const targetY = ((index * angle - 90) * Math.PI) / 180
          if (activated === 'frontend') {
            /** Temp */
            console.log('targetX:', targetX)
          }
          /** Temp */
          const key = `test-${serviceIdType}`
          return (
            <motion.div
              key={key}
              layoutId={key}
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
                  stiffness: 170,
                  damping: 20,
                  delay: index * 0.05,
                },
              }}
              style={{
                border: '1px solid blue',
                position: 'absolute',
                width: `${elementSize}px`,
                aspectRatio: '1',
                transformOrigin: '50% 50%',
              }}
              onMouseEnter={() => setActivated(serviceIdType as ServiceIdType)}
              onMouseLeave={() => {
                // console.log('leave')
                // return setActivated(null)
              }}
            >
              <PreButton serviceIdType={serviceIdType as ServiceIdType} />
            </motion.div>
          )
        })}
        {/* <AnimatePresence> */}
        {activated && (
          <motion.div
            style={{
              border: '1px solid red',
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
              top: '50%',
              left: '50%',
              width: '70px',
              height: '70px',
            }}
            layoutId={`test-${activated}`}
            key={`temp-${activated}`}
          >
            <Image
              h="50%"
              w="50%"
              src={serviceConfig[activated].imageUrl}
              alt="frontend"
            />
          </motion.div>
        )}
        {/* </AnimatePresence> */}
      </Box>
      {/* </LayoutGroup> */}
    </div>
  )
})

const PreButton = function PreButton({
  serviceIdType,
}: {
  serviceIdType: ServiceIdType
}) {
  const flowInstance = useReactFlow()
  const [isClicked, setIsClicked] = useState(false)

  if (isClicked) return null

  const key = `test-${serviceIdType}`
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: CSSVAR['--surface'],
        pointerEvents: 'auto',
      }}
      onClick={() => {
        const position = flowInstance.screenToFlowPosition({
          x: window.innerWidth / 2 - CARD_WIDTH / 2,
          y: window.innerHeight / 2 - CARD_HEIGHT_DEFAULT / 2,
        })
        const newNode = getNewNode({
          id: key,
          position,
          serviceIdType: serviceIdType as ServiceIdType,
        })
        flowInstance.setNodes((oldNodes) => [...oldNodes, newNode])
        setIsClicked(true)
      }}
    >
      <Image
        h="50%"
        w="50%"
        src={serviceConfig[serviceIdType as ServiceIdType].imageUrl}
        alt="frontend"
      />
    </div>
  )
}
