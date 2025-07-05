import { CSSVAR } from '@/contants'
import {
  CARD_HEIGHT_DEFAULT,
  CARD_WIDTH,
  serviceConfig,
  // serviceConfig,
  ServiceIdType,
} from '@/pages/BoardPage/configs/constants'
import { getNewNode } from '@/pages/BoardPage/configs/helpers'
import { Box, Image } from '@mantine/core'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useState } from 'react'
import { useReactFlow } from 'reactflow'

const elementSize = 50

const serviceConfigArr = Object.entries(serviceConfig)

export default (function ToolbarMenu({
  showToolbarMenu,
  onEndSelectionAnimation,
  onStartSelectionAnimation,
}: {
  showToolbarMenu: boolean
  onStartSelectionAnimation: () => void
  onEndSelectionAnimation: () => void
}) {
  // Calculate the radius based on number of elements and element size
  const elementsNumber = serviceConfigArr.length
  const radius = Math.max(50, elementSize * 1.5)
  const containerSize = radius * 2
  const angleStep = 360 / elementsNumber

  const [idFragment, setIdFragment] = useState<string>(String(Math.random()))
  const triggerNewFragment = useCallback(() => {
    setIdFragment(String(Math.random()))
  }, [])

  const [selectedType, setSelectedType] = useState<ServiceIdType | null>()

  const flowInstance = useReactFlow()

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
      <Box h={`${containerSize}px`} w={`${containerSize}px`} pos="relative">
        <AnimatePresence
          mode="popLayout"
          onExitComplete={() => {
            setSelectedType(null)
            triggerNewFragment()
            onEndSelectionAnimation()
          }}
        >
          {showToolbarMenu &&
            serviceConfigArr.map(([serviceIdType], index) => {
              const angle = ((index * angleStep - 90) * Math.PI) / 180
              const x =
                radius * Math.cos(angle) + containerSize / 2 - elementSize / 2
              const y =
                radius * Math.sin(angle) + containerSize / 2 - elementSize / 2

              const layoutId = `${serviceIdType}-${idFragment}`
              return (
                <motion.div
                  key={serviceIdType}
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
                  exit={
                    // TODO : add a custom on animatepresence
                    selectedType !== serviceIdType
                      ? {
                          opacity: 0,
                          scale: 0.5,
                          transition: {
                            duration: 0.2,
                            ease: 'easeOut',
                          },
                        }
                      : undefined
                  }
                  style={{
                    position: 'absolute',
                    width: `${elementSize}px`,
                    aspectRatio: '1',
                    transformOrigin: '50% 50%',
                  }}
                >
                  <PreButton
                    onClick={() => {
                      const position = flowInstance.screenToFlowPosition({
                        x: window.innerWidth / 2 - CARD_WIDTH / 2,
                        y: window.innerHeight / 2 - CARD_HEIGHT_DEFAULT / 2,
                      })
                      const newNode = getNewNode({
                        id: layoutId,
                        position,
                        serviceIdType: serviceIdType as ServiceIdType,
                      })
                      flowInstance.setNodes((oldNodes) => [
                        ...oldNodes,
                        newNode,
                      ])
                      setSelectedType(selectedType)
                      onStartSelectionAnimation()
                    }}
                    layoutId={layoutId}
                    serviceIdType={serviceIdType as ServiceIdType}
                  />
                </motion.div>
              )
            })}
        </AnimatePresence>
      </Box>
    </div>
  )
})

const PreButton = function PreButton({
  serviceIdType,
  onClick,
  layoutId,
}: {
  serviceIdType: ServiceIdType
  layoutId: string
  onClick: () => void
}) {
  return (
    <motion.div
      layoutId={layoutId}
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
        onClick()
      }}
    >
      <motion.div
        layoutId={`${layoutId}-image`}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          padding: 10,
        }}
      >
        <Image
          h={40}
          w={40}
          src={serviceConfig[serviceIdType as ServiceIdType].imageUrl}
          alt="frontend"
        />
      </motion.div>
    </motion.div>
  )
}
