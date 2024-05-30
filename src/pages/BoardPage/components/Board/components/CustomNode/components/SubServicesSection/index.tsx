import { Box, SimpleGrid, Text } from '@mantine/core'
import { v4 } from 'uuid'
import { SubService } from '../../../../constants'
import DividerWrapper from '../DividerWrapper'
import { DraggableSubServiceComponent } from './components/SubServiceComponent'

interface Props {
  subServices: SubService[]
}

export default function SubServiceSection({ subServices }: Props) {
  return (
    <Box>
      <DividerWrapper>
        <Text size="xs">Internal Services</Text>
      </DividerWrapper>

      <SimpleGrid cols={5} verticalSpacing="xs">
        {subServices.map((subService: SubService) => (
          <DraggableSubServiceComponent key={v4()} subService={subService} />
        ))}
      </SimpleGrid>
    </Box>
  )
}
