import DroppableIndicator from '@/components/DroppableIndicator'
import GuidanceTextsMain from '@/components/GuidanceTextsComponents/GuidanceTextsMain'
import { CSSVAR } from '@/contants'
import { boardDataContext } from '@/contexts/BoardData/constants'
import DroppableHintProvider from '@/contexts/DroppableHints/DroppableHintProvider'
import { onBoardingContext } from '@/contexts/Onboarding/constants'
import { Box } from '@mantine/core'
import { useDisclosure, useElementSize } from '@mantine/hooks'
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  EdgeTypes,
  MiniMap,
  NodeTypes,
  ReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useContext } from 'react'
import { v4 } from 'uuid'
import DroppableArea from '../../../../components/DroppableArea/index'
import { clickCanvaContext } from '../../../../contexts/ClickCanvaCapture/constants'
import {
  NO_DRAG_REACTFLOW_CLASS,
  NO_PAN_REACTFLOW_CLASS,
  NO_WhEEL_REACTFLOW_CLASS,
} from '../../configs/constants'
import { BoardLoading } from './components/BoardLoading/index'
import ClearCurrentBoard from './components/ClearCurrentBoardModal'
import ConnexionPreview from './components/ConnexionPreview'
import CustomEdge from './components/CustomEdge'
import CustomNode from './components/CustomNode/'
import DeleteCurrentBoardModal from './components/DeleteCurrentBoardModal'
import DraggableGhost from './components/DraggableGhost/index'
import EdgeCreationButtons from './components/EdgeCreationButtons'
import InfoModal from './components/InfosModal'
import OnBoardingPanel from './components/OnBoardingPanel'
import OnBoardingIntegrated from './components/OnBoaringIntegrated'
import PrimaryActionsPanel from './components/PrimaryActionsPanel'
import SecondaryActionsPaner from './components/SecondaryActionsPanel'
import Settings from './components/Settings/index'
import ShareModal from './components/ShareModal'
import TertiaryActionsPanel from './components/TertiaryActionsPanel'
import ToolbarMenu from './components/ToolbarMenu'
import { useOnConnect } from './hooks/useOnConnect'
import { useOnEdgesChange } from './hooks/useOnEdgesChange'
import { useOnNodeDragEnd } from './hooks/useOnNodeDragEnd'
import { useOnNodesChange } from './hooks/useOnNodesChange'
import { useOpenToolbarMenu } from './hooks/useOpenToolbarMenu'
import { useShowBoardSpinner } from './hooks/useShowBoardSpinner'
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
  // temp
  const [isTempOpen, isTempOpenHandlers] = useDisclosure(true)
  const { showGuidanceTexts, showInfosModal, updateShowInfosModal } =
    useContext(onBoardingContext)
  const { nodes, edges } = useContext(boardDataContext)
  const [showResetBoardModal, clearCurrentBoardModalHandlers] =
    useDisclosure(false)
  const [showDeleteCurrentBoardModal, deleteCurrentBoardModalHandlers] =
    useDisclosure(false)
  const [showShareModal, shareModalHanders] = useDisclosure(false)
  const [
    { isOpen: showToolbarMenu, coordinate: toolbarMenuCoordinate },
    toolbarMenuHandlers,
  ] = useOpenToolbarMenu()

  const { ref, height, width } = useElementSize()
  const { triggerClickCanva } = useContext(clickCanvaContext)
  const showBoardSpinner = useShowBoardSpinner()
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
              minZoom={0.75}
              fitViewOptions={{ duration: 700, maxZoom: 1, minZoom: 0.65 }}
              maxZoom={1}
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
              onMoveStart={() => {
                toolbarMenuHandlers.close()
              }}
              onPaneContextMenu={(e) => {
                e.preventDefault()
                toolbarMenuHandlers.toggle([e.clientX, e.clientY])
              }}
              proOptions={{
                hideAttribution: true,
              }}
              onClick={(e) => e.preventDefault()}
              onPaneClick={() => {
                toolbarMenuHandlers.close()
                triggerClickCanva()
              }}
            >
              {!showGuidanceTexts && !showInfosModal && (
                <Background id={v4()} variant={BackgroundVariant.Dots} />
              )}
              {showGuidanceTexts && <GuidanceTextsMain />}

              {showBoardSpinner && <BoardLoading />}

              {!showGuidanceTexts && !showInfosModal && !isTempOpen && (
                <MiniMap
                  style={{ backgroundColor: CSSVAR['--surface-strong'] }}
                  nodeBorderRadius={10}
                  nodeStrokeWidth={5}
                  nodeStrokeColor={CSSVAR['--text']}
                  nodeColor={CSSVAR['--surface-strong']}
                  maskColor="#00000066"
                />
              )}
              <SecondaryActionsPaner
                openShowInfosModal={() => updateShowInfosModal(true)}
                showGuidanceTexts={showGuidanceTexts}
              />
              <EdgeCreationButtons />

              <OnBoardingPanel
                isTempOpen={isTempOpen}
                toggleTempOpen={isTempOpenHandlers.toggle}
              />
              <OnBoardingIntegrated />
            </ReactFlow>
            <ToolbarMenu
              onStartSelectionAnimation={() => {
                toolbarMenuHandlers.close()
                toolbarMenuHandlers.lock()
              }}
              onEndSelectionAnimation={() => {
                toolbarMenuHandlers.unlock()
              }}
              coordinate={toolbarMenuCoordinate}
              showToolbarMenu={showToolbarMenu}
            />
            <Settings
              openClearCurrentBoardModal={clearCurrentBoardModalHandlers.open}
              openDeleteCurrentBoardModal={deleteCurrentBoardModalHandlers.open}
            />
            <PrimaryActionsPanel openShareModal={shareModalHanders.open} />
            <TertiaryActionsPanel />
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
      <InfoModal
        close={() => updateShowInfosModal(false)}
        opened={showInfosModal}
      />
    </>
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
