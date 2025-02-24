import { Fit, Layout, useRive } from '@rive-app/react-canvas'
import { useEffect } from 'react'

interface Props {
  artboard: string
  showInitialLoader: boolean
}

export default function Canva({ showInitialLoader, artboard }: Props) {
  const { rive, RiveComponent } = useRive({
    src: '/onBoarding/mas.riv',
    stateMachines: 'main',
    layout: new Layout({ fit: Fit.Cover }),
    artboard,
  })

  useEffect(() => {
    if (rive) {
      if (showInitialLoader) rive.pause()
      else rive.play()
    }
  }, [rive, showInitialLoader])

  return (
    <div key={artboard} style={{ width: '100%', height: '100%' }}>
      <RiveComponent />
    </div>
  )
}
