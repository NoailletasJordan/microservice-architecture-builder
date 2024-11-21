import OnBoardingToolbar from '@/components/OnboardingComponents/OnBoardingToolbar'
import TooltipWrapper from '@/components/TooltipWrapper'
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

export default function Toolbar() {
  const { showOnBoarding } = useContext(onBoardingContext)

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

  return (
    <Panel position="top-center">
      {/* catch drops before it falls on board, not doing anything with it tho */}
      <DroppableArea
        id="toolbox"
        data={{
          droppableType: 'toolbox',
        }}
      >
        <Card bg="background.9" p="0.4rem" shadow="md">
          <SimpleGrid cols={6} spacing="0.3rem">
            {services}
          </SimpleGrid>
        </Card>
      </DroppableArea>

      {showOnBoarding && <OnBoardingToolbar />}
    </Panel>
  )
}
