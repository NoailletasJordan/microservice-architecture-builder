import { droppableHintsContext } from '@/contexts/DroppableHints/constants'
import { Card, Switch } from '@mantine/core'
import { useContext } from 'react'
import { Panel } from 'reactflow'

export default function SwitchDropHints() {
  const { droppableHintsChecked, setDroppableHintsChecked } = useContext(
    droppableHintsContext,
  )

  return (
    <Panel position="top-left">
      <Card p="sm" bg="transparent">
        <Switch
          checked={droppableHintsChecked}
          onChange={(event) =>
            setDroppableHintsChecked(event.currentTarget.checked)
          }
          label="Drop hints"
        />
      </Card>
    </Panel>
  )
}
