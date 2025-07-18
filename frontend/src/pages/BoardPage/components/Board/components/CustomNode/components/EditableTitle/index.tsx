import EditableInput from '@/components/EditableText'
import { IService, TCustomNode } from '@/pages/BoardPage/configs/constants'
import { useDisclosure } from '@mantine/hooks'
import { useReactFlow } from '@xyflow/react'
import { TCustomEdge } from '../../../connexionContants'

interface Props {
  service: IService
}

export default function NodeTitle({ service }: Props) {
  const flowInstance = useReactFlow<TCustomNode, TCustomEdge>()
  const [isOpen, { close, open }] = useDisclosure(false)

  const onTitleChange = (value: string) => {
    const nodeToEdit = flowInstance.getNode(service.id)!
    const newNode = structuredClone(nodeToEdit)

    newNode.data.title = value
    flowInstance.setNodes((nodes) =>
      nodes.map((compNode) => {
        if (compNode.id !== service.id) return compNode
        return newNode
      }),
    )
  }

  return (
    <EditableInput
      closeEdit={close}
      isEditing={isOpen}
      onChange={onTitleChange}
      openEdit={open}
      value={service.title}
    />
  )
}
