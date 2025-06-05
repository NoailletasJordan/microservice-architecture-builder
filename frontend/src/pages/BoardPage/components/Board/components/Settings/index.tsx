import { clickCanvaContext } from '@/contexts/ClickCanvaCapture/constants'
import { ActionIcon, Card, Group, Menu } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconMenu2 } from '@tabler/icons-react'
import { useContext, useEffect } from 'react'
import { Panel } from 'reactflow'
import BoardTitle from './components/BoardTitle'
import Dropdown from './components/Dropdown'

interface Props {
  openResetModal: () => void
}

export default function Settings({ openResetModal }: Props) {
  const { canvaClickIncrement } = useContext(clickCanvaContext)
  const [isOpened, { close, toggle }] = useDisclosure(false)

  useEffect(() => {
    canvaClickIncrement !== 0 && close()
  }, [canvaClickIncrement, close])

  return (
    <Panel position="top-left">
      <Menu position="bottom-start" shadow="md" opened={isOpened}>
        <Target toggleOpenModal={toggle} />

        <Dropdown openResetModal={openResetModal} />
      </Menu>
    </Panel>
  )
}

function Target({ toggleOpenModal }: { toggleOpenModal: () => void }) {
  return (
    <Menu.Target>
      <Card radius="md" p={0}>
        <Group align="center" p="xs">
          <ActionIcon
            variant="transparent"
            onClick={toggleOpenModal}
            data-testid="button-settings"
          >
            <IconMenu2 />
          </ActionIcon>
          <BoardTitle />
        </Group>
      </Card>
    </Menu.Target>
  )
}
