import StrongText from '@/components/StrongText'
import {
  ICON_STYLE,
  IService,
  serviceConfig,
} from '@/pages/BoardPage/configs/constants'
import { handleUpdateNode } from '@/pages/BoardPage/configs/helpers'
import { Box, Group, Select, ThemeIcon } from '@mantine/core'
import { groupBy, mapValues } from 'lodash'
import { useMemo } from 'react'
import { useReactFlow } from 'reactflow'
import { TechnologiesKeys } from '../../../../../../configs/technologies'
import DividerWrapper from '../DividerWrapper'

interface Props {
  serviceWithTechnologie: IService
}

export default function TechnologieEditor({
  serviceWithTechnologie: service,
}: Props) {
  const technology = service.technology!
  const serviceIdType = service.serviceIdType
  const { technologies } = serviceConfig[serviceIdType]
  const { color, icon: Icon } = technologies[technology]
  const flowInstance = useReactFlow<IService>()

  const onSearchChange = (newTechnology: TechnologiesKeys) => {
    if (!newTechnology || newTechnology === technology) return
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
    <Box>
      <DividerWrapper>
        <StrongText>Main Technology</StrongText>
      </DividerWrapper>

      <Select
        size="sm"
        variant="unstyled"
        searchValue={technology}
        onSearchChange={(v) => onSearchChange(v as TechnologiesKeys)}
        allowDeselect={false}
        data={Object.entries(groupedByUnderlying).map(([group, items]) => ({
          group,
          items: items.map((item) => item!.key),
        }))}
        leftSection={
          <ThemeIcon size="lg" color={color} variant="transparent">
            {Icon && <Icon style={ICON_STYLE} />}
          </ThemeIcon>
        }
        rightSectionWidth="1.7rem"
        leftSectionPointerEvents="none"
        renderOption={({ option }) => {
          const optionValue = option.value as TechnologiesKeys
          const Icon = technologies[optionValue].icon
          const color = technologies[optionValue].color
          return (
            <Group align="center" gap="0.4rem" wrap="nowrap">
              <ThemeIcon color={color} variant="outline">
                {Icon && <Icon style={ICON_STYLE} />}
              </ThemeIcon>
              {option.label}
            </Group>
          )
        }}
      />
    </Box>
  )
}
