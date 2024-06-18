import DroppableIndicator from '@/components/DroppableIndicator'
import OnBoardingHelp from '@/components/OnboardingComponents/OnBoardingHelp'
import OnBoardingMain from '@/components/OnboardingComponents/OnBoardingMain'
import DroppableHintProvider from '@/contexts/DroppableHints/DroppableHintProvider'
import { onBoardingContext } from '@/contexts/Onboarding/constants'
import { ActionIcon, Box, useMantineTheme } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { IconHelp } from '@tabler/icons-react'
import { cloneDeep, omit } from 'lodash'
import { useCallback, useContext, useEffect, useState } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionMode,
  EdgeTypes,
  NodeDragHandler,
  NodeTypes,
  Panel,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { v4 as uuidv4, v4 } from 'uuid'
import DroppableArea from '../../../../components/DroppableArea/index'
import { clickCanvaContext } from '../../../../contexts/ClickCanvaCapture/constants'
import {
  ICON_STYLE,
  IService,
  NO_DRAG_REACTFLOW_CLASS,
  NO_PAN_REACTFLOW_CLASS,
  NO_WhEEL_REACTFLOW_CLASS,
  STORAGE_DATA_INDEX_KEY,
  SubService,
  TCustomNode,
} from '../../configs/constants'
import {
  getNodeOverlapped,
  handleDeleteNode,
  storeInLocal,
} from '../../configs/helpers'
import ConnexionPreview from './components/ConnexionPreview'
import CustomEdge from './components/CustomEdge'
import CustomNode from './components/CustomNode/'
import DeleteModal from './components/DeleteModal'
import DraggableGhost from './components/DraggableGhost/index'
import FitToView from './components/FitToView/index'
import LoadUrlBoardModal from './components/LoadUrlBoardModal'
import PrimaryActionsPanel from './components/PrimaryActionsPanel'
import Settings from './components/Settings/index'
import ShareModal from './components/ShareModal'
import Toolbar from './components/Toolbar'
import { IConnexion, TCustomEdge } from './components/connexionContants'

const DEBOUNCE_SAVE_MS = 600

const nodeTypes: NodeTypes = {
  service: CustomNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

const preventScrollbarOnPan = { overflow: 'hidden' }
const droppableType = 'board'

interface Props {
  nodeState: ReturnType<typeof useNodesState<IService>>
  edgeState: ReturnType<typeof useEdgesState<IConnexion>>
}

export default function Board({ nodeState, edgeState }: Props) {
  const { showOnBoarding } = useContext(onBoardingContext)
  const [nodes, setNodes, onNodesChange] = nodeState
  const [edges, setEdges, onEdgesChange] = edgeState
  const [showResetBoardModal, setShowResetModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const theme = useMantineTheme()
  const { ref, height, width } = useElementSize()
  const flowInstance = useReactFlow<IService, IConnexion>()
  const { triggerClickCanva } = useContext(clickCanvaContext)

  const onNodeDragEnd: NodeDragHandler = (_event, node: TCustomNode) => {
    const targetNode = getNodeOverlapped(node, nodes)
    if (!targetNode) return

    // Delete node and add it as a subService
    handleDeleteNode(node.id, flowInstance)
    const newSubService: SubService = {
      ...omit(node.data, 'subServices'),
      parentId: targetNode.data.id,
    }
    targetNode.data.subServices = [
      ...targetNode.data.subServices,
      newSubService,
    ]

    setNodes((oldNodes) =>
      oldNodes.map((compNode) =>
        compNode.id === targetNode.id ? cloneDeep(targetNode) : compNode,
      ),
    )
  }

  // Save board to localstorage, debounced
  useEffect(() => {
    const handle = setTimeout(() => {
      const dataToStore = { nodes, edges, timestamp: new Date() }
      storeInLocal(STORAGE_DATA_INDEX_KEY, dataToStore)
    }, DEBOUNCE_SAVE_MS)

    return () => {
      clearTimeout(handle)
    }
  }, [nodes, edges])

  const onConnect = useCallback(
    ({ source, sourceHandle, target, targetHandle }: Connection) => {
      const id = uuidv4()
      const newEdge: TCustomEdge = {
        id,
        source: source!,
        target: target!,
        sourceHandle,
        targetHandle,
        type: 'custom',
        data: {
          id,
          direction: 'duplex',
          note: '',
        },
      }

      const edgeAlleadyExist = !!edges.filter(
        (compEdge) =>
          (compEdge.source === source || compEdge.source === target) &&
          (compEdge.target === source || compEdge.target === target),
      ).length

      const connectToSelf = source === target
      if (edgeAlleadyExist || connectToSelf) return

      setEdges((oldEdges) => addEdge(newEdge, oldEdges))
    },
    [setEdges, edges],
  )

  return (
    <>
      <DroppableHintProvider>
        <DroppableArea id="board" data={{ droppableType }}>
          <Box
            w="100%"
            h="100vh"
            style={preventScrollbarOnPan}
            bg={theme.colors.gray[0]}
            pos="relative"
            ref={ref}
          >
            <DroppableIndicator
              height={height}
              padding={20}
              width={width}
              droppableType={droppableType}
            />
            <ReactFlow
              minZoom={1}
              maxZoom={1}
              fitView={!showOnBoarding}
              onConnect={onConnect}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              edgeTypes={edgeTypes}
              connectionLineComponent={ConnexionPreview}
              onNodeDragStop={onNodeDragEnd}
              noDragClassName={NO_DRAG_REACTFLOW_CLASS}
              noWheelClassName={NO_WhEEL_REACTFLOW_CLASS}
              noPanClassName={NO_PAN_REACTFLOW_CLASS}
              proOptions={{
                hideAttribution: true,
              }}
              onPaneClick={triggerClickCanva}
            >
              <FitToView />
              {!showOnBoarding && (
                <Background id={v4()} variant={BackgroundVariant.Dots} />
              )}

              <Toolbar />

              {showOnBoarding && <OnBoardingMain />}

              <Panel position="bottom-right">
                {showOnBoarding && <OnBoardingHelp />}

                <ActionIcon variant="light" color="gray" size="lg">
                  <IconHelp style={ICON_STYLE} />
                </ActionIcon>
              </Panel>
            </ReactFlow>
            <Settings openResetModal={() => setShowResetModal(true)} />
            <PrimaryActionsPanel
              openShareModal={() => setShowShareModal(true)}
            />
            <DraggableGhost />
          </Box>
        </DroppableArea>
      </DroppableHintProvider>

      <DeleteModal
        close={() => setShowResetModal(false)}
        opened={showResetBoardModal}
      />
      <ShareModal
        opened={showShareModal}
        close={() => setShowShareModal(false)}
      />
      <LoadUrlBoardModal />
    </>
  )
}
