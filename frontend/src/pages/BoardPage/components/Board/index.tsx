import DroppableIndicator from '@/components/DroppableIndicator'
import GuidanceTextsMain from '@/components/GuidanceTextsComponents/GuidanceTextsMain'
import { CSSVAR, useEffectEventP } from '@/contants'
import { boardDataContext } from '@/contexts/BoardData/constants'
import { useQueryKey } from '@/contexts/BoardData/hooks/useQueryKey'
import DroppableHintProvider from '@/contexts/DroppableHints/DroppableHintProvider'
import { onBoardingContext } from '@/contexts/Onboarding/constants'
import { ActionIcon, Box } from '@mantine/core'
import { useDisclosure, useElementSize } from '@mantine/hooks'
import { IconArrowBackUp, IconArrowForwardUp } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useRef } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionMode,
  EdgeTypes,
  MiniMap,
  NodeTypes,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { v4 } from 'uuid'
import DroppableArea from '../../../../components/DroppableArea/index'
import { clickCanvaContext } from '../../../../contexts/ClickCanvaCapture/constants'
import {
  ICON_STYLE,
  NO_DRAG_REACTFLOW_CLASS,
  NO_PAN_REACTFLOW_CLASS,
  NO_WhEEL_REACTFLOW_CLASS,
  TCustomNode,
} from '../../configs/constants'
import { useStateHistory } from '../../temp'
import ClearCurrentBoard from './components/ClearCurrentBoardModal'
import { TCustomEdge } from './components/connexionContants'
import ConnexionPreview from './components/ConnexionPreview'
import CustomEdge from './components/CustomEdge'
import CustomNode from './components/CustomNode/'
import DeleteCurrentBoardModal from './components/DeleteCurrentBoardModal'
import DraggableGhost from './components/DraggableGhost/index'
import DemoModal from './components/OnboardingModal'
import PrimaryActionsPanel from './components/PrimaryActionsPanel'
import SecondaryActionsPaner from './components/SecondaryActionsPanel'
import Settings from './components/Settings/index'
import ShareModal from './components/ShareModal'
import Toolbar from './components/Toolbar'
import { useOnNodeDragEnd } from './hooks/onNodeDragEnd'
import { useOnConnect } from './hooks/useOnConnect'
import { useOnEdgesChange } from './hooks/useOnEdgesChange'
import { useOnNodesChange } from './hooks/useOnNodesChange'
import { TBoardDataStore } from './hooks/useSetNodes'
import LoadUrlBoardModal from './services/LoadUrlBoardModal'

const nodeTypes: NodeTypes = {
  service: CustomNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

const preventScrollbarOnPan = { overflow: 'hidden' }
const droppableType = 'board'

export default function Board() {
  const { showGuidanceTexts, showOnboarding, updateShowOnboarding } =
    useContext(onBoardingContext)
  const { nodes, edges } = useContext(boardDataContext)
  const [showResetBoardModal, clearCurrentBoardModalHandlers] =
    useDisclosure(false)
  const [showDeleteCurrentBoardModal, deleteCurrentBoardModalHandlers] =
    useDisclosure(false)
  const [showShareModal, shareModalHanders] = useDisclosure(false)

  const { ref, height, width } = useElementSize()
  const { triggerClickCanva } = useContext(clickCanvaContext)

  const onNodesChange = useOnNodesChange()
  const onEdgesChange = useOnEdgesChange()
  const onConnect = useOnConnect({ edges })
  const onNodeDragEnd = useOnNodeDragEnd()

  return (
    <>
      <DroppableHintProvider>
        <DroppableArea id="board" data={{ droppableType }}>
          <Box
            data-testid="board"
            w="100%"
            h="100vh"
            style={{
              ...preventScrollbarOnPan,
              cursor: showGuidanceTexts ? '' : '',
            }}
            pos="relative"
            ref={ref}
            className={showGuidanceTexts ? NO_PAN_REACTFLOW_CLASS : ''}
          >
            <DroppableIndicator
              height={height}
              padding={20}
              width={width}
              droppableType={droppableType}
            />
            {showGuidanceTexts && defaultPointerStyle}

            <ReactFlow
              translateExtent={[
                [-2520, -1890],
                [2520, 1890],
              ]}
              nodeExtent={[
                [-2320, -1690],
                [2320, 1690],
              ]}
              minZoom={0.65}
              fitViewOptions={{ duration: 700, maxZoom: 1, minZoom: 0.65 }}
              maxZoom={2}
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
              zoomOnDoubleClick={false}
              snapGrid={[30, 30]}
              snapToGrid={true}
              proOptions={{
                hideAttribution: true,
              }}
              onPaneClick={triggerClickCanva}
            >
              {!showGuidanceTexts && !showOnboarding && (
                <Background id={v4()} variant={BackgroundVariant.Dots} />
              )}
              <Toolbar />
              {showGuidanceTexts && <GuidanceTextsMain />}
              <MiniMap
                style={{ backgroundColor: CSSVAR['--surface-strong'] }}
                nodeBorderRadius={10}
                nodeStrokeWidth={5}
                nodeStrokeColor={CSSVAR['--text']}
                nodeColor={CSSVAR['--surface-strong']}
                maskColor="#00000066"
              />
              <SecondaryActionsPaner
                openOnboarding={() => updateShowOnboarding(true)}
                showGuidanceTexts={showGuidanceTexts}
              />
            </ReactFlow>
            <Settings
              openClearCurrentBoardModal={clearCurrentBoardModalHandlers.open}
              openDeleteCurrentBoardModal={deleteCurrentBoardModalHandlers.open}
            />
            <PrimaryActionsPanel openShareModal={shareModalHanders.open} />
            <PanelBottomLeft />
            <DraggableGhost />
          </Box>
        </DroppableArea>
      </DroppableHintProvider>

      <ClearCurrentBoard
        close={clearCurrentBoardModalHandlers.close}
        opened={showResetBoardModal}
      />
      <DeleteCurrentBoardModal
        close={deleteCurrentBoardModalHandlers.close}
        opened={showDeleteCurrentBoardModal}
      />
      <ShareModal
        nodes={nodes}
        opened={showShareModal}
        close={shareModalHanders.close}
      />
      <LoadUrlBoardModal />
      <DemoModal
        close={() => updateShowOnboarding(false)}
        opened={showOnboarding}
      />
    </>
  )
}

function PanelBottomLeft() {
  const [_, handlers, history] = useStateHistory<{
    nodes: TCustomNode[]
    edges: TCustomEdge[]
  }>({
    nodes: [],
    edges: [],
  })

  const { nodes, edges, boardDataQuery } = useContext(boardDataContext)
  const isFetched = boardDataQuery.isFetched

  const queryClient = useQueryClient()
  const queryKey = useQueryKey()

  function revertHistory() {
    const newIndex = history.current - 1

    const currentData: TBoardDataStore | undefined =
      queryClient.getQueryData(queryKey)
    queryClient.setQueryData(queryKey, {
      ...currentData,
      nodes: history.history[newIndex].nodes,
      edges: history.history[newIndex].edges,
    })
    handlers.back()
  }

  function forwardHistory() {
    if (history.current === history.history.length - 1) return

    const newIndex = history.current + 1
    const currentData: TBoardDataStore | undefined =
      queryClient.getQueryData(queryKey)
    queryClient.setQueryData(queryKey, {
      ...currentData,
      nodes: history.history[newIndex].nodes,
      edges: history.history[newIndex].edges,
    })
    handlers.forward()
  }

  const nonReactiveState = useEffectEventP(() => ({
    handlers,
    history,
    queryKey,
  }))

  const isFetchedRefPrev = useRef(isFetched)
  const queryKeyRefPrev = useRef(queryKey)
  useEffect(() => {
    const { handlers, queryKey } = nonReactiveState()
    const justChangedBoard = queryKeyRefPrev.current[1] !== queryKey[1]

    if (justChangedBoard) {
      queryKeyRefPrev.current = queryKey
      handlers.reset({ nodes, edges })
      return
    }

    if (!isFetched) {
      isFetchedRefPrev.current = false
      return
    }

    const justBeenFetched = !isFetchedRefPrev.current && isFetched
    if (justBeenFetched) {
      isFetchedRefPrev.current = true
      handlers.updateIndex({ value: { nodes, edges }, index: 0 })
      return
    }

    const { history } = nonReactiveState()
    const timeoutDelay =
      history.current === history.history.length - 1 ? 350 : 0

    const handle = setTimeout(() => {
      const isDraggingNode = nodes.some((node) => node.dragging)

      const currentData = { nodes, edges }
      const dataInHistory = {
        nodes: history.history[history.current].nodes,
        edges: history.history[history.current].edges,
      }

      const isEqual =
        JSON.stringify(currentData) === JSON.stringify(dataInHistory)

      if (!isEqual && !isDraggingNode && isFetched) {
        handlers.set(currentData)
      }
    }, timeoutDelay)

    return () => {
      clearTimeout?.(handle)
    }
  }, [nodes, edges, isFetched, nonReactiveState])

  return (
    <Panel position="bottom-left">
      <ActionIcon.Group>
        <ActionIcon
          disabled={!isFetched || history.current === 0}
          size="lg"
          variant="light"
          color="white"
          aria-label="Undo"
          onClick={revertHistory}
        >
          <IconArrowBackUp style={ICON_STYLE} />
        </ActionIcon>

        <ActionIcon
          disabled={
            !isFetched || history.current === history.history.length - 1
          }
          aria-label="Redo"
          onClick={forwardHistory}
          size="lg"
          variant="light"
          color="white"
        >
          <IconArrowForwardUp style={ICON_STYLE} />
        </ActionIcon>
      </ActionIcon.Group>
    </Panel>
  )
}

const defaultPointerStyle = (
  <style>
    {`
        .react-flow__pane {
          cursor: default;
        }
        .react-flow__pane.dragging {
          cursor: default;
        }
      `}
  </style>
)
