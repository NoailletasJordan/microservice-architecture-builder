import { AutocompleteProps, Stack, Text } from '@mantine/core'
import Editing from './components/Editing'
import NonEditing from './components/NonEditing'

interface EditableInputProps {
  isEditing: boolean
  openEdit: () => void
  closeEdit: () => void
  onChange: (value: string) => void
  value: string
  label?: string
  autocompleteOptions?: AutocompleteProps['data']
}

export default function EditableInput(props: EditableInputProps) {
  const {
    closeEdit,
    onChange,
    openEdit,
    isEditing,
    value,
    label,
    autocompleteOptions,
  } = props
  return (
    <Stack gap="0">
      {label && (
        <Text size="xs" c="primary">
          {label}
        </Text>
      )}
      {isEditing ? (
        <Editing
          options={autocompleteOptions}
          onChange={onChange}
          onClickValidate={closeEdit}
          value={value}
        />
      ) : (
        <NonEditing value={value} onClickEdit={openEdit} />
      )}
    </Stack>
  )
}
