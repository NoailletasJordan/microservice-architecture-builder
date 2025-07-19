import { ViewportPortal } from '@xyflow/react'
import EdgeCreationButton from './components/CreationButton'
import { useGenerateNodeDuets_ } from './hooks/useGenerateNodeDuets_'

export default function EdgeCreationButtons() {
  const duets = useGenerateNodeDuets_()

  return (
    <ViewportPortal>
      {duets.map((duet) => (
        <EdgeCreationButton key={duet.join('-')} duet={duet} />
      ))}
    </ViewportPortal>
  )
}
