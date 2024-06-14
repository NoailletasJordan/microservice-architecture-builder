import ConnexionLabelItems from '@/components/ConnexionLabelItems'
import { EdgeProps, getSmoothStepPath, useReactFlow } from 'reactflow'
import { DashedLine, FullLine } from '../../../../../../components/Lines/index'
import { IConnexion } from '../connexionContants'

export default function CustomEdge(props: EdgeProps<IConnexion>) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
  } = props

  const { setEdges } = useReactFlow()
  const { connexionType, direction } = data!

  const [bezierPathReverse] = getSmoothStepPath({
    sourceX: targetX,
    sourceY: targetY,
    sourcePosition: targetPosition,
    targetPosition: sourcePosition,
    targetX: sourceX,
    targetY: sourceY,
  })
  const [bezierPathCenter, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  })

  const handleDeleteEdge = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id))
  }

  let lineComponent
  switch (direction) {
    case 'forward':
      lineComponent = <DashedLine path={bezierPathCenter} />
      break

    case 'reverse':
      lineComponent = <DashedLine path={bezierPathReverse} />
      break

    default:
      lineComponent = <FullLine path={bezierPathCenter} />
      break
  }

  return (
    <>
      {lineComponent}
      <ConnexionLabelItems
        handleDeleteEdge={handleDeleteEdge}
        labelX={labelX}
        labelY={labelY}
        connexionId={id}
        connexionType={connexionType}
        previewLineOnly={false}
        connexion={props.data!}
      />
    </>
  )
}
