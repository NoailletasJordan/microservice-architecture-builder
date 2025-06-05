import EditableInput from '@/components/EditableText'
import { IService } from '@/pages/BoardPage/configs/constants'
import { useDisclosure } from '@mantine/hooks'
import { cloneDeep } from 'lodash'
import { useReactFlow } from 'reactflow'

interface Props {
  service: IService
}

export default function NodeTitle({ service }: Props) {
  const flowInstance = useReactFlow()
  const [isOpen, { close, open }] = useDisclosure(false)

  const onTitleChange = (value: string) => {
    const nodeToEdit = flowInstance.getNode(service.id)!
    const newNode = cloneDeep(nodeToEdit)

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
