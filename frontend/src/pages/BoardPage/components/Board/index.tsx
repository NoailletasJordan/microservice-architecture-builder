import DroppableIndicator from '@/components/DroppableIndicator'
import GuidanceTextsMain from '@/components/GuidanceTextsComponents/GuidanceTextsMain'
import { boardDataContext } from '@/contexts/BoardData/constants'
import DroppableHintProvider from '@/contexts/DroppableHints/DroppableHintProvider'
import { onBoardingContext } from '@/contexts/Onboarding/constants'
import { userContext } from '@/contexts/User/constants'
import { Box, Loader } from '@mantine/core'
import { useDisclosure, useElementSize } from '@mantine/hooks'
import { useContext } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionMode,
  EdgeTypes,
  NodeTypes,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { v4 } from 'uuid'
import DroppableArea from '../../../../components/DroppableArea/index'
import { clickCanvaContext } from '../../../../contexts/ClickCanvaCapture/constants'
import {
  NO_DRAG_REACTFLOW_CLASS,
  NO_PAN_REACTFLOW_CLASS,
  NO_WhEEL_REACTFLOW_CLASS,
} from '../../configs/constants'
import ConnexionPreview from './components/ConnexionPreview'
import CustomEdge from './components/CustomEdge'
import CustomNode from './components/CustomNode/'
import DeleteModal from './components/DeleteModal'
import DemoPanel from './components/DemoPanel'
import DraggableGhost from './components/DraggableGhost/index'
import DemoModal from './components/OnboardingModal'
import PrimaryActionsPanel from './components/PrimaryActionsPanel'
import Settings from './components/Settings/index'
import ShareModal from './components/ShareModal'
import Toolbar from './components/Toolbar'
import UserBoards from './components/UserBoards'
import { useOnNodeDragEnd } from './hooks/onNodeDragEnd'
import { useOnConnect } from './hooks/useOnConnect'
import { useOnEdgesChange } from './hooks/useOnEdgesChange'
import { useOnNodesChange } from './hooks/useOnNodesChange'
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
  const [showResetBoardModal, resetModalHandlers] = useDisclosure(false)
  const [showShareModal, shareModalHanders] = useDisclosure(false)

  const { ref, height, width } = useElementSize()
  const { triggerClickCanva } = useContext(clickCanvaContext)

  const onNodesChange = useOnNodesChange()
  const onEdgesChange = useOnEdgesChange()
  const onConnect = useOnConnect({ edges })
  const onNodeDragEnd = useOnNodeDragEnd()

  const { authToken } = useContext(userContext)

  return (
    <>
      <DroppableHintProvider>
        <DroppableArea id="board" data={{ droppableType }}>
          <Box
            w="100%"
            h="100vh"
            style={preventScrollbarOnPan}
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
              minZoom={0.65}
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
              <DemoPanel
                openOnboarding={() => updateShowOnboarding(true)}
                showGuidanceTexts={showGuidanceTexts}
              />
            </ReactFlow>
            <Settings openResetModal={resetModalHandlers.open} />
            <PrimaryActionsPanel openShareModal={shareModalHanders.open} />
            {authToken && <UserBoards />}
            <DraggableGhost />
            <BoardLoadingState />
          </Box>
        </DroppableArea>
      </DroppableHintProvider>

      <DeleteModal
        close={resetModalHandlers.close}
        opened={showResetBoardModal}
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

function BoardLoadingState() {
  const { boardDataQuery } = useContext(boardDataContext)
  return (
    <Panel position="bottom-center">
      {boardDataQuery?.fetchStatus === 'fetching' && (
        <Box bg="green" p="md">
          <Loader />
        </Box>
      )}
    </Panel>
  )
}
