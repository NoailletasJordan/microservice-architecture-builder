import { Autocomplete, AutocompleteProps, Kbd } from '@mantine/core'
import { getHotkeyHandler, useFocusWithin } from '@mantine/hooks'

interface Props {
  onChange: (event: string) => void
  value: string
  onClickValidate: () => void
  options: AutocompleteProps['data']
}

export default function InputEdit({
  onChange,
  value,
  onClickValidate,
  options,
}: Props) {
  const { ref } = useFocusWithin({
    onBlur: () => {
      onClickValidate()
    },
  })

  return (
    <div ref={ref}>
      <Autocomplete
        autoFocus
        onChange={onChange}
        value={value}
        data={options}
        size="xs"
        rightSection={
          <Kbd size="xs" mr="sm" onClick={onClickValidate}>
            Enter
          </Kbd>
        }
        aria-label="Endoint"
        onKeyDown={getHotkeyHandler([['Enter', onClickValidate]])}
      />
    </div>
  )
}
