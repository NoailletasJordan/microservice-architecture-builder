import { CSSVAR } from '@/contants'
import { clickCanvaContext } from '@/contexts/ClickCanvaCapture/constants'
import { onBoardingContext } from '@/contexts/Onboarding/constants'
import { ActionIcon, Box, Card, Group, Menu } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconMenu2 } from '@tabler/icons-react'
import { useContext, useEffect } from 'react'
import { Panel } from 'reactflow'
import OnGuidanceTextsSettings from '../../../../../../components/GuidanceTextsComponents/GuidanceTextsSettings/index'
import BoardTitle from './components/BoardTitle'
import Dropdown from './components/Dropdown'

interface Props {
  openClearCurrentBoardModal: () => void
  openDeleteCurrentBoardModal: () => void
}

export default function Settings({
  openClearCurrentBoardModal,
  openDeleteCurrentBoardModal,
}: Props) {
  const { canvaClickIncrement } = useContext(clickCanvaContext)
  const [isOpened, { close, toggle }] = useDisclosure(false)

  useEffect(() => {
    canvaClickIncrement !== 0 && close()
  }, [canvaClickIncrement, close])

  return (
    <Panel position="top-left">
      <Menu position="bottom-start" shadow="md" opened={isOpened}>
        <Target toggleOpenModal={toggle} />

        <Dropdown
          openClearCurrentBoardModal={openClearCurrentBoardModal}
          openDeleteCurrentBoardModal={openDeleteCurrentBoardModal}
          closeMenu={close}
        />
      </Menu>
    </Panel>
  )
}

function Target({ toggleOpenModal }: { toggleOpenModal: () => void }) {
  const { showGuidanceTexts } = useContext(onBoardingContext)

  return (
    <Menu.Target>
      <Box pos="relative">
        <Card radius="sm" bg={CSSVAR['--surface']} p={0}>
          <Group align="flex-start" p="xs">
            <ActionIcon
              mt={4}
              variant="transparent"
              onClick={(e) => {
                e.stopPropagation()
                toggleOpenModal()
              }}
              data-testid="button-settings"
            >
              <IconMenu2 />
            </ActionIcon>
            <BoardTitle />
          </Group>
        </Card>
        {showGuidanceTexts && <OnGuidanceTextsSettings />}
      </Box>
    </Menu.Target>
  )
}
