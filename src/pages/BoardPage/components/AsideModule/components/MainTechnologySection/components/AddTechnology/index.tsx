import { TechnologiesKeys } from '@/pages/BoardPage/components/Board/components/CustomNode/components/TechnologieSelector/technologies-constant'
import { handleUpdateNode } from '@/pages/BoardPage/helpers'
import {
  Box,
  Button,
  Group,
  Menu,
  ScrollArea,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { groupBy, mapValues, upperFirst } from 'lodash'
import { useMemo } from 'react'
import { useReactFlow } from 'reactflow'
import {
  ICON_STYLE,
  IService,
  serviceConfig,
} from '../../../../../Board/constants'

interface Props {
  service: IService
}

export default function AddTechnology({ service }: Props) {
  const technology = service.technology!
  const serviceIdType = service.serviceIdType
  const { technologies } = serviceConfig[serviceIdType]
  const flowInstance = useReactFlow<IService>()

  const groupedByUnderlying = useMemo(() => {
    const transformedTechnologyFrontend = mapValues(
      technologies,
      (value, key) => {
        return { ...value, key: key }
      },
    )
    return groupBy(transformedTechnologyFrontend, 'underlying')
    // comparing "technologies" might be heavy, using "serviceIdType" instead
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceIdType])

  const onSearchChange = (newTechnology: TechnologiesKeys) => {
    if (!newTechnology || newTechnology === technology) return
    const nodes = flowInstance.getNodes()
    const newNode = nodes.find(({ data }) => data.id === service.id)!
    newNode.data.technology = newTechnology
    handleUpdateNode(service.id, newNode, flowInstance)
  }

  const target = (
    <Button
      leftSection={<IconPlus style={ICON_STYLE} />}
      fullWidth
      size="xs"
      variant="outline"
      radius="lg"
    >
      Add a main technology
    </Button>
  )
  return (
    <Menu shadow="md">
      <Menu.Target>{target}</Menu.Target>

      <Menu.Dropdown miw={250}>
        <ScrollArea type="auto" h={300}>
          {Object.entries(groupedByUnderlying).map(([groupLabel, techlist]) => (
            <Box key={groupLabel}>
              <Menu.Label key={groupLabel}>
                <Text component="span">{upperFirst(groupLabel)}</Text>
              </Menu.Label>
              {techlist.map(({ color, key, icon: Icon }) => (
                <Menu.Item
                  key={key}
                  onClick={() => onSearchChange(key as TechnologiesKeys)}
                >
                  <Group align="center" gap="0.4rem" wrap="nowrap">
                    <ThemeIcon color={color} variant="outline">
                      <Icon style={ICON_STYLE} />
                    </ThemeIcon>
                    {key}
                  </Group>
                </Menu.Item>
              ))}
            </Box>
          ))}
        </ScrollArea>
      </Menu.Dropdown>
    </Menu>
  )
}
