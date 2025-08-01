import { SubService } from '@/pages/BoardPage/configs/constants'
import { Box, SimpleGrid } from '@mantine/core'
import { LayoutGroup } from 'motion/react'
import { DraggableSubServiceComponent } from './components/SubServiceComponent'
import SubServicesHeader from './components/SubServicesHeader'

interface Props {
  subServices: SubService[]
  parentId: string
}

export default function SubServiceSection({ subServices, parentId }: Props) {
  return (
    <Box>
      <LayoutGroup>
        <SubServicesHeader parentId={parentId} />
      </LayoutGroup>

      <SimpleGrid cols={4} verticalSpacing="xs">
        {subServices.map((subService: SubService) => (
          <DraggableSubServiceComponent
            key={`sub-service-${subService.id}`}
            subService={subService}
          />
        ))}
      </SimpleGrid>
    </Box>
  )
}
