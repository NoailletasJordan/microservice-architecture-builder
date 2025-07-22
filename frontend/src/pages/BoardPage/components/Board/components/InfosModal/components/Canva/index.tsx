import { Loader } from '@mantine/core'
import { Fit, Layout, useRive } from '@rive-app/react-canvas'
import { useEffect, useState } from 'react'

interface Props {
  artboard: string
}

export default function Canva({ artboard }: Props) {
  const [isRiveLoading, setIsRiveLoading] = useState(true)
  const { rive, RiveComponent } = useRive({
    src: '/onBoarding/mas.riv',
    stateMachines: 'main',
    layout: new Layout({ fit: Fit.Cover }),
    artboard,
  })

  useEffect(() => {
    if (rive) {
      rive.play()
      setIsRiveLoading(false)
    }
  }, [rive])

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
