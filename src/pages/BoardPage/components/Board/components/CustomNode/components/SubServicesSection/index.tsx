import StrongText from '@/components/StrongText'
import { SubService } from '@/pages/BoardPage/configs/constants'
import { Box, SimpleGrid } from '@mantine/core'
import { v4 } from 'uuid'
import DividerWrapper from '../DividerWrapper'
import { DraggableSubServiceComponent } from './components/SubServiceComponent'

interface Props {
  subServices: SubService[]
}

export default function SubServiceSection({ subServices }: Props) {
  return (
    <Box>
      <DividerWrapper>
        <StrongText>Internal Services</StrongText>
      </DividerWrapper>

      <SimpleGrid cols={5} verticalSpacing="xs">
        {subServices.map((subService: SubService) => (
          <DraggableSubServiceComponent key={v4()} subService={subService} />
        ))}
      </SimpleGrid>
    </Box>
  )
}
