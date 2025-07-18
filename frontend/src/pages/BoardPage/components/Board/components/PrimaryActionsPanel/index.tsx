import { Group } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Panel } from '@xyflow/react'
import SharableButton from './components/SharableButton'

interface Props {
  openShareModal: () => void
}

export default function PrimaryActionsPanel({ openShareModal }: Props) {
  const maxXS = useMediaQuery('(max-width: 576px)')

  return (
    <Panel position="top-right">
      <Group gap="xs">
        <SharableButton shrink={!!maxXS} onClick={openShareModal} />
      </Group>
    </Panel>
  )
}
