import TooltipWrapper from '@/components/TooltipWrapper'
import { boardDataContext } from '@/contexts/BoardData/constants'
import { userContext } from '@/contexts/User/constants'
import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Loader, TextInput } from '@mantine/core'
import { IconRouter, IconRouterOff } from '@tabler/icons-react'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import useOnTitleChange from './hooks/useOnTitleChange'
import usePushMutation from './hooks/usePushMutation'
import { useTitleValidator } from './hooks/useTitleValidator'

export default function BoardTitle() {
  const { title, boardDataQuery } = useContext(boardDataContext)
  const onChange = useOnTitleChange()
  const pushMutation = usePushMutation()
  const { isLogged } = useContext(userContext)
  const { currentUserBoardId } = useContext(userBoardsContext)

  const isLoading = !boardDataQuery.isFetched && boardDataQuery.isFetching
  const Icon = useMemo(
    () => (isLogged ? IconRouter : IconRouterOff),
    [isLogged],
  )
  const { error, isError } = useTitleValidator()

  // prevents caret from jumping on query cache update
  // https://stackoverflow.com/a/68928267
  const [cursor, setCursor] = useState<number | null>(null)
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    ref.current?.setSelectionRange(cursor, cursor)
  }, [ref, cursor, title])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCursor(e.target.selectionStart)
    onChange?.(e)
  }

  return (
    <TextInput
      ref={ref}
      data-testid="board-title"
      error={!isLoading && error}
      maxLength={50}
      onChange={handleChange}
      onBlur={() => {
        if (!currentUserBoardId || isError || isLoading) return

        return pushMutation(title)
      }}
      value={title}
      fw="bold"
      variant={isLogged ? 'default' : 'unstyled'}
      readOnly={!isLogged}
      rightSection={
        isLoading ? (
          <Loader size="xs" />
        ) : (
          <TooltipWrapper
            position="right"
            label={
              isLogged
                ? 'Your work is saved in the cloud'
                : 'Your work is saved on your browser'
            }
          >
            <Icon
              data-testid={isLogged ? testIdLogged : testIdLogoff}
              stroke={1.5}
              color={isLogged ? 'white' : 'gray'}
              style={ICON_STYLE}
            />
          </TooltipWrapper>
        )
      }
    />
  )
}

export const testIdLogged = 'icon-router'
export const testIdLogoff = 'icon-router-off'
