import { useMemo } from 'react'
import { Variants } from 'motion/react'

export function useAnimationVariants_() {
  const animationVariants = useMemo(() => {
    const createVariants = (isMovingForward: boolean): Variants => ({
      visible: {
        transition: { duration: 0.35, ease: 'easeOut' },
        opacity: 1,
        x: 0,
      },
      hidden: {
        transition: { duration: 0.35, ease: 'easeOut' },
        opacity: 0,
        x: isMovingForward ? 10 : -10,
      },
    })
    return createVariants
  }, [])

  return animationVariants
}