import { handleUpdateNode } from '@/pages/BoardPage/helpers'
import { ActionIcon, Grid } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useReactFlow } from 'reactflow'
import TechnologieEditor from '../../../Board/components/CustomNode/components/TechnologieSelector'
import { ICON_STYLE, IService } from '../../../Board/constants'
import AddTechnology from './components/AddTechnology'

interface Props {
  service: IService
}

export default function MainTechnologySection({ service }: Props) {
  const hasTechnology = !!service.technology
  const flowInstance = useReactFlow()

  const handleDeleteTechnology = () => {
    const nodes = flowInstance.getNodes()
    const newNode = nodes.find(({ data }) => data.id === service.id)!
    delete newNode.data.technology
    handleUpdateNode(service.id, newNode, flowInstance)
  }

  const component = !hasTechnology ? (
    <AddTechnology service={service} />
  ) : (
    <Grid align="end" gutter={0}>
      <Grid.Col span="auto">
        {service.technology && (
          <TechnologieEditor serviceWithTechnologie={service} />
        )}
      </Grid.Col>

      <Grid.Col span="content">
        <ActionIcon
          onClick={handleDeleteTechnology}
          color="grey"
          variant="subtle"
          size="md"
          mb=".3rem"
        >
          <IconTrash style={ICON_STYLE} />
        </ActionIcon>
      </Grid.Col>
    </Grid>
  )

  return component
}
