import { Fit, Layout, useRive } from '@rive-app/react-canvas'

export default function Canva() {
  const { rive, RiveComponent } = useRive({
    src: '/onBoarding/mas.riv',
    stateMachines: 'main',
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover }),
    artboard: 'welcome',
  })

  return <RiveComponent />
}
