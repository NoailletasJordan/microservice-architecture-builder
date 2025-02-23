import { Fit, Layout, useRive } from '@rive-app/react-canvas'

interface Props {
  artboard: string
}

export default function Canva({ artboard }: Props) {
  const { rive, RiveComponent } = useRive({
    src: '/onBoarding/mas.riv',
    stateMachines: 'main',
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover }),
    artboard,
  })

  return (
    <div key={artboard} style={{ width: '100%', height: '100%' }}>
      <RiveComponent />
    </div>
  )
}
