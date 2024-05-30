import IconCustomArrowDown from '@/components/IconsCustom/IconCustomArrowDown'
import TooltipWrapper from '@/components/TooltipWrapper'
import { ActionIcon, Box, Menu, ThemeIcon } from '@mantine/core'
import { useState } from 'react'

interface Props {
  connexionConfig: ConnexionConfig
}

type ConnexionType = 'http' | 'ws' | 'grapql' | 'rpc' | 'kafka'
export type ConnexionConfig = Record<
  ConnexionType,
  {
    label: string
    Icon: JSX.ElementType
  }
>

export default function CommunicationTool({ connexionConfig }: Props) {
  const [selectedLink, setSelectedLink] = useState<ConnexionType | null>('http')

  let selectedIcon
  if (selectedLink) {
    const { Icon } = connexionConfig[selectedLink]
    selectedIcon = <Icon />
  }

  const target = (
    <ActionIcon component="div" size="lg" variant="light">
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 150ms ease, opacity 100ms ease',
          width: '100%',
          height: '100%',
          transform: 'translateY(-3px)',
          position: 'absolute',
          top: 0,
        }}
      >
        {selectedIcon}
      </Box>

      <IconCustomArrowDown />
    </ActionIcon>
  )

  return (
    <Menu shadow="md" width="3rem">
      <Menu.Target>{target}</Menu.Target>

      <Menu.Dropdown>
        {Object.entries(connexionConfig)
          .filter(([compKey]) => compKey !== selectedLink)
          .map(([connectionType, { Icon, label }]) => (
            <Menu.Item
              key={connectionType}
              onClick={() => setSelectedLink(connectionType as ConnexionType)}
            >
              <TooltipWrapper label={label} position="right">
                <Box
                  style={{
                    transform: 'translateX(-9px) translateY(-3px)',
                    height: 30,
                  }}
                >
                  <ThemeIcon size="lg" variant="subtle">
                    <Icon />
                  </ThemeIcon>
                </Box>
              </TooltipWrapper>
            </Menu.Item>
          ))}
      </Menu.Dropdown>
    </Menu>
  )
}
