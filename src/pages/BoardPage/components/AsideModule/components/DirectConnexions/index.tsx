import { selectedNodeContext } from '@/contexts/SelectedNode/constants'
import {
  ActionIcon,
  Box,
  Card,
  Flex,
  Group,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { IconAffiliate, IconTrash } from '@tabler/icons-react'
import { useContext } from 'react'
import { Edge, Node, useEdges, useReactFlow } from 'reactflow'
import { ServiceTool } from '../../../Board/components/Toolbar/components/ServiceTool'
import {
  IConnexion,
  connexionConfig,
} from '../../../Board/components/connexionContants'
import {
  ICON_STYLE,
  ServiceIdType,
  TCustomNode,
} from '../../../Board/constants'

interface Props {
  node: TCustomNode
}

export default function DirectLinks({ node }: Props) {
  const flowInstance = useReactFlow()
  const edges = useEdges<IConnexion>()
  const currentService = node.data
  const { setServiceId: setSelectedServiceId } = useContext(selectedNodeContext)

  const edgesFromCurrentService = edges.filter(
    (edge) =>
      edge.source === currentService.id || edge.target === currentService.id,
  )

  const handleDelete = (id: Edge['id']) => {
    flowInstance.setEdges((edges) => edges.filter((edge) => edge.id !== id))
  }

  if (!edgesFromCurrentService.length) return

  return (
    <Box>
      <Text>Direct Connexion(s)</Text>
      <Card withBorder>
        {edgesFromCurrentService.map((edge) => {
          const externalNodeId =
            edge.source !== currentService.id ? edge.source : edge.target
          const externalNode = flowInstance.getNode(externalNodeId) as
            | TCustomNode
            | undefined

          if (!externalNode) return null

          return (
            <Connection
              key={edge.id}
              externalServiceIdType={externalNode.data.serviceIdType}
              node={node}
              edge={edge}
              connexionType={edge.data!.connexionType}
              handleDelete={() => handleDelete(edge.id)}
              handleClick={() => setSelectedServiceId(externalNode.data.id)}
            />
          )
        })}
      </Card>
    </Box>
  )
}
interface ConnexionProps {
  node: Node
  edge: Edge
  handleDelete: () => void
  externalServiceIdType: ServiceIdType
  handleClick: () => void
  connexionType: IConnexion['connexionType']
}
const Connection = (props: ConnexionProps) => {
  const Icon = connexionConfig[props.connexionType].Icon
  return (
    <Card.Section withBorder p="0.2rem">
      <Group align="center">
        <ThemeIcon variant="white">
          <IconAffiliate style={ICON_STYLE} />
        </ThemeIcon>
        <ServiceTool serviceIdType={props.externalServiceIdType} />
        <Flex align="center" h={30} w={30} c="indigo">
          <Icon />
        </Flex>

        <ActionIcon
          onClick={props.handleDelete}
          variant="subtle"
          color="grey"
          ml="auto"
        >
          <IconTrash style={ICON_STYLE} />
        </ActionIcon>
      </Group>
    </Card.Section>
  )
}
