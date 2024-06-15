import { droppableHintsContext } from '@/contexts/DroppableHints/constants'
import {
  DraggableData,
  DraggableType,
  DroppableType,
} from '@/pages/BoardPage/configs/constants'
import { useDndContext } from '@dnd-kit/core'
import { useMantineTheme } from '@mantine/core'
import { useContext, useMemo } from 'react'
import { IService } from '../../pages/BoardPage/configs/constants'

interface Props {
  width: number
  height: number
  padding: number
  droppableType: DroppableType
  serviceId?: IService['id']
}

type Rules = 'preventSameService' | 'preventOtherServices'

const config: Record<
  DraggableType,
  Partial<{
    [droppableType in DroppableType]: Rules[]
  }>
> = {
  'dashboard-item': {
    board: [],
    node: [],
  },
  subService: {
    board: [],
    node: ['preventSameService'],
    delete: ['preventOtherServices'],
  },
}

const STROKE_WIDTH = 2
export default function DroppableIndicator({
  width,
  height,
  padding,
  droppableType,
  serviceId,
}: Props) {
  const { droppableHintsChecked } = useContext(droppableHintsContext)
  const theme = useMantineTheme()
  const { active } = useDndContext()
  const elementCurrentlyDragged = active?.data?.current as
    | DraggableData
    | undefined

  const draggedFromSameService =
    elementCurrentlyDragged?.draggedContent &&
    (elementCurrentlyDragged.draggedContent as { parentId?: string })
      .parentId === serviceId

  const getShowIndicator = (): boolean => {
    if (!droppableHintsChecked || !elementCurrentlyDragged) return false

    const draggableType = elementCurrentlyDragged.draggableType as DraggableType
    if (!(droppableType in config[draggableType])) return false

    const rules = config[draggableType][droppableType]!

    if (rules.includes('preventSameService') && draggedFromSameService)
      return false
    if (rules.includes('preventOtherServices') && !draggedFromSameService)
      return false

    return true
  }

  const showIndicator = useMemo(getShowIndicator, [
    droppableType,
    draggedFromSameService,
    elementCurrentlyDragged,
    droppableHintsChecked,
  ])

  const color = theme.colors[theme.primaryColor][2]

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        left: 0,
        top: -STROKE_WIDTH,
        width: showIndicator ? `100%` : 0,
        height,
        position: 'absolute',
        pointerEvents: 'none',
        userSelect: 'none',
        alignItems: 'center',
        opacity: showIndicator ? 1 : 0,
        transition: 'opacity 300ms linear',
      }}
    >
      <svg
        // Rerender on values changes
        // https://github.com/software-mansion/react-native-svg/issues/142#issuecomment-247319732
        key={height + String(showIndicator) + String(width)}
        preserveAspectRatio="none"
        width={`calc(${width}px - ${padding * 2}px)`}
        height={`calc(${height}px - ${padding * 2}px)`}
        className="svg-border"
      >
        <rect
          className="rect"
          x="1"
          y="1"
          width={`calc(100% - ${STROKE_WIDTH}px)`}
          height={`calc(100% - ${STROKE_WIDTH}px)`}
          rx="5"
          ry="5"
          fill="transparent"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeDashoffset={30}
          strokeDasharray="10,10"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="20"
            dur="1s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  )
}
