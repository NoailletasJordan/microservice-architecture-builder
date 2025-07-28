import { onBoardingContext } from '@/contexts/Onboarding/constants'
import confetti from 'canvas-confetti'
import { useContext, useEffect, useRef } from 'react'

export default function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { onboardingIsActive, onboardingStepIndex } =
    useContext(onBoardingContext)
  useEffect(() => {
    if (onboardingIsActive && onboardingStepIndex === 3) {
      const confettiInCanvas = confetti.create(canvasRef.current!, {
        resize: true,
      })
      confettiInCanvas({
        particleCount: 100,
        spread: 70,
        origin: {
          y: 0.5,
          x: 0.5,
        },
        startVelocity: 35,
      })
    }
  }, [onboardingStepIndex, onboardingIsActive])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        width: '150vw',
        height: '150vh',
        transform: 'translate(calc(-50% + 200px), -50%)',
      }}
    />
  )
}
