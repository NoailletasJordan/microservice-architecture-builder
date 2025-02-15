import DividerWrapper from '@/components/DividerWrapper'
import { SubService } from '@/pages/BoardPage/configs/constants'
import { Box, SimpleGrid, Text } from '@mantine/core'
import { v4 } from 'uuid'
import { DraggableSubServiceComponent } from './components/SubServiceComponent'

interface Props {
  subServices: SubService[]
}

export default function SubServiceSection({ subServices }: Props) {
  return (
    <Box>
      <DividerWrapper>
        <Text fw="600" size="sm">
          Internal Services
        </Text>
      </DividerWrapper>

      <SimpleGrid cols={4} verticalSpacing="xs">
        {subServices.map((subService: SubService) => (
          <DraggableSubServiceComponent key={v4()} subService={subService} />
        ))}
      </SimpleGrid>
    </Box>
  )
}
