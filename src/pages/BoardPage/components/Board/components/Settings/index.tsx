import { clickCanvaContext } from '@/contexts/ClickCanvaCapture/constants'
import { onBoardingContext } from '@/contexts/Onboarding/constants'
import { ICON_STYLE } from '@/pages/BoardPage/configs/constants'
import { ActionIcon, Divider, Menu } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconMenu2 } from '@tabler/icons-react'
import { useContext, useEffect } from 'react'
import { Panel } from 'reactflow'
import Github from './components/Github'
import ResetBoard from './components/ResetBoard'
import SwitchDropHints from './components/SwitchDropHints'

interface Props {
  openResetModal: () => void
}

export default function Settings({ openResetModal }: Props) {
  const { canvaClickIncrement } = useContext(clickCanvaContext)
  const [isOpened, { close, toggle }] = useDisclosure(false)
  const { showGuidanceTexts } = useContext(onBoardingContext)

  useEffect(() => {
    canvaClickIncrement !== 0 && close()
  }, [canvaClickIncrement, close])

  const target = (
    <Menu.Target>
      <ActionIcon onClick={toggle}>
        <IconMenu2 style={ICON_STYLE} />
      </ActionIcon>
    </Menu.Target>
  )

  return (
    <Panel position="top-left">
      <Menu shadow="md" opened={isOpened}>
        {target}

        <Menu.Dropdown p="xs">
          <ResetBoard openResetModal={openResetModal} />
          <Github />
          <Divider my="xs" />

          <SwitchDropHints />
        </Menu.Dropdown>
      </Menu>
    </Panel>
  )
}
