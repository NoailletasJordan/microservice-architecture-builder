import IconCustomArrowDown from '@/components/IconsCustom/IconCustomArrowDown'
import { connexionContext } from '@/contexts/Connexion/constants'
import { ActionIcon, Box, Group, Menu, Text, ThemeIcon } from '@mantine/core'
import { groupBy } from 'lodash'
import { useContext } from 'react'
import { IConnexionType, connexionConfig } from '../../../connexionContants'

export default function CommunicationTool() {
  const { connexionType, setConnexionType } = useContext(connexionContext)
  const connexionsByGroup = groupBy(connexionConfig, 'group')

  const Icon = connexionConfig[connexionType].Icon
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
        <Icon />
      </Box>

      <IconCustomArrowDown />
    </ActionIcon>
  )

  return (
    <Menu shadow="md">
      <Menu.Target>{target}</Menu.Target>

      <Menu.Dropdown>
        {Object.entries(connexionsByGroup).map(([group, listItem]) => {
          return (
            <Box key={group}>
              <Menu.Label key={group}>
                <Text fw="700" size="sm">
                  {group}
                </Text>
              </Menu.Label>

              {listItem.map(({ Icon, label, value }) => (
                <Menu.Item
                  key={value}
                  h={40}
                  onClick={() => setConnexionType(value as IConnexionType)}
                >
                  <Group gap="xs">
                    <Box h={30} mt="-.25rem">
                      <ThemeIcon size="lg" variant="light">
                        <Icon />
                      </ThemeIcon>
                    </Box>
                    <Text fs="initial">{label}</Text>
                  </Group>
                </Menu.Item>
              ))}
            </Box>
          )
        })}
      </Menu.Dropdown>
    </Menu>
  )
}
