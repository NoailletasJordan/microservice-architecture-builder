import { TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useEdges, useNodes } from '@xyflow/react'
import StepFirstNodeCreated from './components/StepFirstNodeCreated'
import StepSecondNodeCreated from './components/StepSecondNodeCreated'

export default function OnBoardingIntegrated() {
  const nodes = useNodes<TCustomNode>()
  const edges = useEdges()

  let component = null

  if (nodes.length === 1) {
    component = <StepFirstNodeCreated firstNode={nodes[0]} />
  } else if (nodes.length === 2 && edges.length === 0) {
    component = (
      <StepSecondNodeCreated firstNode={nodes[0]} secondNode={nodes[1]} />
    )
  }

  return component
}
