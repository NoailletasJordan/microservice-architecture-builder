import OnBoardingToolbar from '@/components/OnboardingComponents/OnBoardingToolbar'
import TooltipWrapper from '@/components/TooltipWrapper'
import { CSSVAR } from '@/contants'
import { onBoardingContext } from '@/contexts/Onboarding/constants'
import {
  ServiceIdType,
  serviceConfig,
} from '@/pages/BoardPage/configs/constants'
import { Card, SimpleGrid } from '@mantine/core'
import { useContext } from 'react'
import { Panel } from 'reactflow'
import DroppableArea from '../../../../../../components/DroppableArea/index'
import { DraggableServiceTool } from './components/ServiceTool'

const services = Object.entries(serviceConfig).map(([serviceIdType]) => (
  <TooltipWrapper
    label={serviceConfig[serviceIdType as ServiceIdType].defaultLabel}
    position="bottom"
    key={serviceIdType}
  >
    <DraggableServiceTool
      key={serviceIdType}
      draggableIndicator
      serviceIdType={serviceIdType as ServiceIdType}
    />
  </TooltipWrapper>
))

export default function Toolbar() {
  const { showOnBoarding } = useContext(onBoardingContext)

  return (
    <Panel position="top-center">
      {/* Prevent from dropping on the board throught the toolbar */}
      <DroppableArea
        id="toolbox"
        data={{
          droppableType: 'toolbox',
        }}
      >
        <Card bg={CSSVAR['--surface']} px="xs" py={8} shadow="md">
          <SimpleGrid cols={6} spacing="0.3rem">
            {services}
          </SimpleGrid>
        </Card>
      </DroppableArea>

      {showOnBoarding && <OnBoardingToolbar />}
    </Panel>
  )
}
