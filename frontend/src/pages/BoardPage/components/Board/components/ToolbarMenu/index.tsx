import { CSSVAR } from '@/contants'
import {
  CARD_HEIGHT_DEFAULT,
  CARD_WIDTH,
  // serviceConfig,
  ServiceIdType,
} from '@/pages/BoardPage/configs/constants'
import { getNewNode } from '@/pages/BoardPage/configs/helpers'
import { Box, Image } from '@mantine/core'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useReactFlow } from 'reactflow'

const elementSize = 80

const serviceConfig = {
  frontend: {
    imageUrl: '/board/a-frontend.svg',
    defaultLabel: 'Frontend',
  },
  server: {
    imageUrl: '/board/a-server.svg',
    defaultLabel: 'Server',
  },
  database: {
    imageUrl: '/board/a-database.svg',
    defaultLabel: 'Database',
  },
}

const serviceConfigArr = Object.entries(serviceConfig)

export default (function ToolbarMenu() {
  // Calculate the radius based on number of elements and element size
  const elementsNumber = serviceConfigArr.length
  const radius = Math.max(50, elementSize * 1.5)
  const containerSize = radius * 2
  const angleStep = 360 / elementsNumber

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
        {serviceConfigArr.map(([serviceIdType], index) => {
          const angle = ((index * angleStep - 90) * Math.PI) / 180
          const x =
            radius * Math.cos(angle) + containerSize / 2 - elementSize / 2
          const y =
            radius * Math.sin(angle) + containerSize / 2 - elementSize / 2
          const layoutKey = `toolbar-${serviceIdType}`
          return (
            <motion.div
              key={layoutKey}
              layoutId={layoutKey}
              initial={{
                x: containerSize / 2 - elementSize / 2,
                y: containerSize / 2 - elementSize / 2,
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                x,
                y,
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
              top: `${containerSize / 2 - elementSize / 2}px`,
              left: `${containerSize / 2 - elementSize / 2}px`,
              width: `${elementSize}px`,
              height: `${elementSize}px`,
            }}
            key={`center-${activated}`}
            layoutId={`toolbar-${activated}`}
          >
            {activated}
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

  const key = `toolbar-${serviceIdType}`
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
