import OnBoardingText from '@/components/OnboardingComponents/OnBoardingText'
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
  const { showOnBoarding } = useContext(onBoardingContext)

  useEffect(() => {
    canvaClickIncrement !== 0 && close()
  }, [canvaClickIncrement, close])

  const target = (
    <Menu.Target>
      <div style={{ position: 'relative' }}>
        <ActionIcon onClick={toggle}>
          <IconMenu2 style={ICON_STYLE} />
        </ActionIcon>
        {showOnBoarding && (
          <div
            style={{
              top: 'calc(100% + 10px)',
              left: '10px',
            }}
          >
            <img width={50} src="/onBoarding/arrow-settings.svg" />
            <OnBoardingText
              style={{ transform: 'translateX(0px) translateY(0px)' }}
              w={150}
            >
              Reset board and settings
            </OnBoardingText>
          </div>
        )}
      </div>
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
