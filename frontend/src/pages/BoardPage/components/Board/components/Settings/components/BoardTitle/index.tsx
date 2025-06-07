import TooltipWrapper from '@/components/TooltipWrapper'
import { boardDataContext } from '@/contexts/BoardData/constants'
import { userContext } from '@/contexts/User/constants'
import { userBoardsContext } from '@/contexts/UserBoards/constants'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { Loader, TextInput } from '@mantine/core'
import { IconRouter, IconRouterOff } from '@tabler/icons-react'
import { useContext, useMemo } from 'react'
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

  return (
    <>
      <TextInput
        error={error}
        maxLength={50}
        onChange={onChange}
        onBlur={() => {
          if (!currentUserBoardId || isError) return

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
              position="bottom"
              label={
                isLogged
                  ? 'Your data is saved in the cloud !'
                  : 'Your board is saved locally in your browser'
              }
            >
              <Icon stroke={1} color="white" style={ICON_STYLE} />
            </TooltipWrapper>
          )
        }
      />
    </>
  )
}
