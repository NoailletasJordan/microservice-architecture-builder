import { getEditorParams } from '@/components/RichEditor'
import { CSSVAR } from '@/contants'
import { clickCanvaContext } from '@/contexts/ClickCanvaCapture/constants'
import {
  IConnexion,
  TCustomEdge,
  connexionConfig,
} from '@/pages/BoardPage/components/Board/components/connexionContants'
import {
  NO_DRAG_REACTFLOW_CLASS,
  NO_PAN_REACTFLOW_CLASS,
  TCustomNode,
} from '@/pages/BoardPage/configs/constants'
import { handleUpdateEdge } from '@/pages/BoardPage/configs/helpers'
import { ActionIcon, Box } from '@mantine/core'
import { IconSettings } from '@tabler/icons-react'
import { useEditor } from '@tiptap/react'
import { EdgeLabelRenderer, useReactFlow } from '@xyflow/react'
import { useContext, useEffect } from 'react'
import ConnexionCollapsableMenu from './components/ConnexionCollapsableMenu/index'

interface Props {
  labelX: number
  labelY: number
  connexionType?: IConnexion['connexionType']
  closeMenu: () => void
  toggleMenu: () => void
  configIsOpen: boolean
  connexion: IConnexion
  handleDeleteEdge: () => void
}

const MENU_VERTICAL_GAP_PX = 20

export default function ConnexionLabelItems({
  labelX,
  labelY,
  handleDeleteEdge,
  connexionType,
  connexion,
  closeMenu,
  toggleMenu,
  configIsOpen,
}: Props) {
  const flowInstance = useReactFlow<TCustomNode, TCustomEdge>()
  const { canvaClickIncrement } = useContext(clickCanvaContext)
  const Icon = connexionType
    ? connexionConfig[connexionType].Icon
    : IconSettings

  useEffect(() => {
    canvaClickIncrement !== 0 && closeMenu()
  }, [canvaClickIncrement, closeMenu])

  const editor = useEditor(
    getEditorParams({
      initialContent: flowInstance.getEdge(connexion.id)!.data?.note || '',
      onUpdate: (note: string) =>
        handleUpdateEdge(connexion.id, { note }, flowInstance),
    }),
  )

  const noteisEmpty = !editor || editor.isEmpty
  const collapseAll = !configIsOpen && !editor?.isFocused && noteisEmpty

  return (
    <EdgeLabelRenderer>
      <div className={`${NO_DRAG_REACTFLOW_CLASS} ${NO_PAN_REACTFLOW_CLASS}`}>
        {(configIsOpen || !!connexion.connexionType || !collapseAll) && (
          <ActionIcon
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              overflow: 'hidden',
              transition: 'opacity 300ms ease-out',
            }}
            size="lg"
            radius="md"
            variant="outline"
            color="gray.10"
            bg={CSSVAR['--surface']}
            onClick={toggleMenu}
          >
            <Icon stroke={1} />
          </ActionIcon>
        )}

        <Box
          className={`${NO_DRAG_REACTFLOW_CLASS} ${NO_PAN_REACTFLOW_CLASS}`}
          style={{
            position: 'absolute',
            transform: `translateX(-50%) translate(${labelX}px,${
              labelY + MENU_VERTICAL_GAP_PX
            }px) `,
            pointerEvents: 'all',
            overflow: 'hidden',
            transition: 'opacity 300ms ease-out',
            zIndex: 1,
          }}
        >
          <ConnexionCollapsableMenu
            handleDeleteEdge={handleDeleteEdge}
            configIsOpen={configIsOpen}
            connexion={connexion}
            collapseAll={collapseAll}
            editor={editor}
          />
        </Box>
      </div>
    </EdgeLabelRenderer>
  )
}
