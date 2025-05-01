import { Loader } from '@mantine/core'
import { Fit, Layout, useRive } from '@rive-app/react-canvas'
import { useEffect, useState } from 'react'

interface Props {
  artboard: string
  showInitialLoader: boolean
}

export default function Canva({ showInitialLoader, artboard }: Props) {
  const [isRiveLoading, setIsRiveLoading] = useState(true)
  const { rive, RiveComponent } = useRive({
    src: '/onBoarding/mas.riv',
    stateMachines: 'main',
    layout: new Layout({ fit: Fit.Cover }),
    artboard,
  })

  useEffect(() => {
    if (rive) {
      if (showInitialLoader) rive.pause()
      else {
        rive.play()
        setIsRiveLoading(false)
      }
    }
  }, [rive, showInitialLoader])

  return (
    <>
      {isRiveLoading && (
        <div>
          <Loader color="gray" type="dots" />
        </div>
      )}

      <div
        key={artboard}
        style={{
          display: isRiveLoading ? 'none' : 'block',
          width: '100%',
          height: '100%',
        }}
      >
        <RiveComponent />
      </div>
    </>
  )
}
