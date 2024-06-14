import {
  IConnexion,
  connexionConfig,
} from '@/pages/BoardPage/components/Board/components/connexionContants'
import {
  ICON_STYLE,
  NO_DRAG_REACTFLOW_CLASS,
  NO_PAN_REACTFLOW_CLASS,
} from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Box } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconSettings } from '@tabler/icons-react'
import { EdgeLabelRenderer } from 'reactflow'
import ConnexionCollapsableMenu from './components/ConnexionCollapsableMenu/index'

interface Props {
  labelX: number
  labelY: number
  opacity?: number
  handleDeleteEdge?: () => void
  connexionId: IConnexion['id']
  connexionType: IConnexion['connexionType']
  // dirty but from "connexionPreview" we don't have the "connexion" yet
  previewLineOnly: boolean
  connexion?: IConnexion
}

const GAP_PX = 30

export default function ConnexionLabelItems({
  previewLineOnly,
  labelX,
  labelY,
  opacity,
  handleDeleteEdge,
  connexionType,
  connexion,
}: Props) {
  const Icon = connexionConfig[connexionType].Icon
  const [configIsOpen, { toggle }] = useDisclosure(false)

  return (
    <EdgeLabelRenderer>
      <div
        className={`${NO_DRAG_REACTFLOW_CLASS} ${NO_PAN_REACTFLOW_CLASS}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ActionIcon
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px) `,
            pointerEvents: 'all',
            overflow: 'hidden',
            opacity,
            transition: 'opacity 300ms ease-out',
          }}
          size="lg"
          radius="md"
          variant={configIsOpen ? 'filled' : 'default'}
          color={configIsOpen ? 'indigo' : 'indigo'}
          onClick={toggle}
        >
          {configIsOpen ? <IconSettings style={ICON_STYLE} /> : <Icon />}
        </ActionIcon>
        <Box
          className={`${NO_DRAG_REACTFLOW_CLASS} ${NO_PAN_REACTFLOW_CLASS}`}
          style={{
            position: 'absolute',
            transform: `translateX(-50%) translate(${labelX}px,${
              labelY + GAP_PX
            }px) `,
            pointerEvents: 'all',
            overflow: 'hidden',
            opacity,
            transition: 'opacity 300ms ease-out',
          }}
        >
          {!previewLineOnly && (
            <ConnexionCollapsableMenu
              handleDeleteEdge={handleDeleteEdge}
              configIsOpen={configIsOpen}
              connexion={connexion!}
            />
          )}
        </Box>
      </div>
    </EdgeLabelRenderer>
  )
}
