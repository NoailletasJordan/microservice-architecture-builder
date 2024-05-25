import { handleUpdateNode } from '@/pages/BoardPage/helpers'
import { Box, Group, Select, Text, ThemeIcon } from '@mantine/core'
import { groupBy, mapValues } from 'lodash'
import { useMemo } from 'react'
import { useReactFlow } from 'reactflow'
import { Datatype, serviceConfig } from '../../../../constants'
import { TechnologiesKeys } from './technologies-constant'

interface Props {
  service: Datatype
}

export default function TechnologieSelector({ service }: Props) {
  const serviceIdType = service.serviceIdType
  const { technologies } = serviceConfig[serviceIdType]
  const { color, icon: Icon } = technologies[service.technology] || {}
  const flowInstance = useReactFlow<Datatype>()

  const onSearchChange = (newTechnology: TechnologiesKeys) => {
    if (!newTechnology || newTechnology === service.technology) return
    const nodes = flowInstance.getNodes()
    const newNode = nodes.find(({ data }) => data.id === service.id)!
    newNode.data.technology = newTechnology
    handleUpdateNode(service.id, newNode, flowInstance)
  }

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

  return (
    <Box onClick={(event) => event.stopPropagation()}>
      <Select
        variant="unstyled"
        searchValue={service.technology}
        onSearchChange={(v) => onSearchChange(v as TechnologiesKeys)}
        allowDeselect={false}
        label={<Text size="xs">Main Technology</Text>}
        data={Object.entries(groupedByUnderlying).map(([group, items]) => ({
          group,
          items: items.map((item) => item!.key),
        }))}
        leftSection={
          <ThemeIcon color={color} variant="outline" mr="xs">
            {Icon && <Icon style={{ width: '70%', height: '70%' }} />}
          </ThemeIcon>
        }
        rightSectionWidth="1.1rem"
        leftSectionPointerEvents="none"
        renderOption={({ option }) => {
          const optionValue = option.value as TechnologiesKeys
          const Icon = technologies[optionValue].icon
          const color = technologies[optionValue].color
          return (
            <Group align="center" gap="0.4rem" wrap="nowrap">
              <ThemeIcon color={color} variant="outline">
                {Icon && <Icon style={{ width: '70%', height: '70%' }} />}
              </ThemeIcon>
              {option.label}
            </Group>
          )
        }}
      />
    </Box>
  )
}
