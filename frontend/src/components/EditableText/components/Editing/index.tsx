import { NO_DRAG_REACTFLOW_CLASS } from '@/pages/BoardPage/configs/constants'
import { Autocomplete, AutocompleteProps, Kbd } from '@mantine/core'
import { getHotkeyHandler } from '@mantine/hooks'
import { useEffect, useState } from 'react'

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
  const [refInput, setRefInput] = useState<HTMLInputElement | null>(null)

  useEffect(() => {
    refInput && refInput.select()
  }, [refInput])

  return (
    <Autocomplete
      className={NO_DRAG_REACTFLOW_CLASS}
      onBlur={onClickValidate}
      ref={setRefInput}
      autoFocus
      onChange={onChange}
      value={value}
      data={options}
      size="xs"
      rightSection={
        <Kbd color="blue" size="xs" mr="sm" onClick={onClickValidate}>
          Enter
        </Kbd>
      }
      aria-label="Endoint"
      onKeyDown={getHotkeyHandler([['Enter', onClickValidate]])}
    />
  )
}
