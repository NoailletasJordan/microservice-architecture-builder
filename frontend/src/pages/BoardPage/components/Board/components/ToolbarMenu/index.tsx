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
import { useCallback, useEffect, useState } from 'react'
import { useReactFlow } from 'reactflow'

const menuItemSize = 50

const serviceConfigArr = Object.entries(serviceConfig)

export default (function ToolbarMenu({
  showToolbarMenu,
  onEndSelectionAnimation,
  onStartSelectionAnimation,
  coordinate,
}: {
  showToolbarMenu: boolean
  onStartSelectionAnimation: () => void
  onEndSelectionAnimation: () => void
  coordinate: [number, number]
}) {
  // Calculate the radius based on number of elements and element size
  const menuItemsCount = serviceConfigArr.length
  const menuRadius = Math.max(50, menuItemSize * 1.5)
  const menuContainerSize = menuRadius * 2
  const angleStep = 360 / menuItemsCount

  const [uniqueIdFragment, setUniqueIdFragment] = useState<string>(String(Math.random()))
  const generateNewIdFragment = useCallback(() => {
    setUniqueIdFragment(String(Math.random()))
  }, [])

  useEffect(() => {
    if (!showToolbarMenu) {
      generateNewIdFragment()
    }
  }, [showToolbarMenu, generateNewIdFragment])

  const reactFlowInstance = useReactFlow()

  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: coordinate[0],
        top: coordinate[1],
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Box h={`${menuContainerSize}px`} w={`${menuContainerSize}px`} pos="relative">
        <AnimatePresence
          mode="popLayout"
          onExitComplete={() => {
            onEndSelectionAnimation()
          }}
        >
          {showToolbarMenu &&
            serviceConfigArr.map(([serviceIdType], index) => {
              const angle = ((index * angleStep - 90) * Math.PI) / 180 // Convert degrees to radians
              const x = menuRadius * Math.cos(angle) + menuContainerSize / 2 - menuItemSize / 2
              const y = menuRadius * Math.sin(angle) + menuContainerSize / 2 - menuItemSize / 2

              const layoutId = `${serviceIdType}-${uniqueIdFragment}`
              return (
                <motion.div
                  key={`menu-item-wrapper-${layoutId}`}
                  initial={{
                    x: menuContainerSize / 2 - menuItemSize / 2,
                    y: menuContainerSize / 2 - menuItemSize / 2,
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
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    transition: {
                      duration: 0.2,
                      ease: 'easeOut',
                    },
                  }}
                  style={{
                    position: 'absolute',
                    width: `${menuItemSize}px`,
                    aspectRatio: '1',
                    transformOrigin: '50% 50%',
                  }}
                >
                  <MenuItem
                    serviceIdType={serviceIdType as ServiceIdType}
                    onClick={() => {
                      const position = reactFlowInstance.screenToFlowPosition({
                        x: coordinate[0] - CARD_WIDTH / 2,
                        y: coordinate[1] - CARD_HEIGHT_DEFAULT / 2,
                      })
                      const newNode = getNewNode({
                        id: layoutId,
                        position,
                        serviceIdType: serviceIdType as ServiceIdType,
                      })
                      reactFlowInstance.setNodes((oldNodes) => [
                        ...oldNodes,
                        newNode,
                      ])
                      onStartSelectionAnimation()
                    }}
                    layoutId={layoutId}
                  />
                </motion.div>
              )
            })}
        </AnimatePresence>
      </Box>
    </div>
  )
})

const MenuItem = function MenuItem({
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
        border: `1px solid ${CSSVAR['--border']}`,
        borderRadius: 6,
        pointerEvents: 'auto',
      }}
      onClick={() => {
        onClick()
      }}
    >
      <motion.div
        layoutId={`${layoutId}-icon`}
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
