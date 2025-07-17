import { CSSVAR } from '@/contants'
import {
  ServiceIdType,
  serviceConfig,
} from '@/pages/BoardPage/configs/constants'
import { Image } from '@mantine/core'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

export function MenuItem({
  serviceIdType,
  onClick,
  layoutId,
}: {
  serviceIdType: ServiceIdType
  layoutId: string
  onClick: () => void
}) {
  const [allowCursorEvent, setAllowCursorEvent] = useState(false)

  // Timeout so it dont get trigger at spawn
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAllowCursorEvent(true)
    }, 200)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <motion.button
      data-testid={`button-menu-item-${serviceIdType}`}
      layoutId={layoutId}
      style={{
        pointerEvents: allowCursorEvent ? 'auto' : 'none',
        display: 'flex',
        cursor: 'pointer',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: CSSVAR['--surface'],
        border: `1px solid ${CSSVAR['--border']}`,
        borderRadius: 6,
      }}
      onClick={onClick}
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
    </motion.button>
  )
}
