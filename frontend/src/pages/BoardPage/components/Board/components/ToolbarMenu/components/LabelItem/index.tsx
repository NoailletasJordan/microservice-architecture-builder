import { CSSVAR } from '@/contants'
import { ServiceIdType } from '@/pages/BoardPage/configs/constants'

interface Props {
  hoveredType: ServiceIdType | null
  serviceConfig: Record<ServiceIdType, any>
  isOpen: boolean
}

export default function LabelItem({
  hoveredType,
  serviceConfig,
  isOpen,
}: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        fontWeight: 'bold',
        transform: 'translate(-50%, -50%)',
        color: CSSVAR['--text'],
      }}
    >
      {isOpen && hoveredType && serviceConfig[hoveredType].defaultLabel}
    </div>
  )
}
