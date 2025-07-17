import {
  CARD_HEIGHT_DEFAULT,
  CARD_WIDTH,
  serviceConfig,
  ServiceIdType,
} from '@/pages/BoardPage/configs/constants'
import { getNewNode } from '@/pages/BoardPage/configs/helpers'
import { Box } from '@mantine/core'
import { AnimatePresence, motion, Variants } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { useReactFlow } from 'reactflow'
import LabelItem from './components/LabelItem'
import { MenuItem } from './components/MenuItem'

const menuItemSize = 60
const menuRadius = 100
const menuContainerSize = 90

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
  const [uniqueIdFragment, setUniqueIdFragment] = useState<string>(
    String(Math.random()),
  )
  const generateNewIdFragment = useCallback(() => {
    setUniqueIdFragment(String(Math.random()))
  }, [])

  useEffect(() => {
    if (!showToolbarMenu) {
      generateNewIdFragment()
    }
  }, [showToolbarMenu, generateNewIdFragment])

  const reactFlowInstance = useReactFlow()
  const [hoveredType, setHoveredType] = useState<ServiceIdType | null>(null)
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
      <Box
        h={`${menuContainerSize}px`}
        w={`${menuContainerSize}px`}
        pos="relative"
      >
        <AnimatePresence
          mode="popLayout"
          onExitComplete={() => {
            onEndSelectionAnimation()
          }}
        >
          {showToolbarMenu &&
            serviceConfigArr.map(([serviceIdType], index) => {
              const layoutId = `${serviceIdType}-${uniqueIdFragment}`
              const tServiceIdType = serviceIdType as ServiceIdType

              return (
                <motion.div
                  onMouseEnter={() => setHoveredType(tServiceIdType)}
                  onMouseLeave={() => setHoveredType(null)}
                  key={`menu-item-wrapper-${layoutId}`}
                  variants={getVariants({
                    index,
                  })}
                  initial="entrance"
                  animate={
                    hoveredType === tServiceIdType ? 'hovered' : 'animate'
                  }
                  exit="exit"
                  style={{
                    position: 'absolute',
                    width: `${menuItemSize}px`,
                    aspectRatio: '1',
                    transformOrigin: '50% 50%',
                  }}
                >
                  <MenuItem
                    serviceIdType={tServiceIdType}
                    onClick={() => {
                      const position = reactFlowInstance.screenToFlowPosition({
                        x: coordinate[0] - CARD_WIDTH / 2,
                        y: coordinate[1] - CARD_HEIGHT_DEFAULT / 2,
                      })
                      const newNode = getNewNode({
                        id: layoutId,
                        position,
                        serviceIdType: tServiceIdType,
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
      <LabelItem
        isOpen={showToolbarMenu}
        hoveredType={hoveredType}
        serviceConfig={serviceConfig}
      />
    </div>
  )
})

const getVariants = ({ index }: { index: number }): Variants => {
  // Calculate the radius based on number of elements and element size
  const menuItemsCount = serviceConfigArr.length
  const angleStep = 360 / menuItemsCount
  const angle = ((index * angleStep - 90) * Math.PI) / 180 // Convert degrees to radians
  const x =
    menuRadius * Math.cos(angle) + menuContainerSize / 2 - menuItemSize / 2
  const y =
    menuRadius * Math.sin(angle) + menuContainerSize / 2 - menuItemSize / 2

  return {
    entrance: {
      x: menuContainerSize / 2 - menuItemSize / 2,
      y: menuContainerSize / 2 - menuItemSize / 2,
      opacity: 0,
      scale: 0.5,
    },
    animate: {
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
    },
    hovered: {
      x,
      y,
      opacity: 1,
      scale: 1.2,
      transition: {
        type: 'tween',
        duration: 0.15,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  }
}
