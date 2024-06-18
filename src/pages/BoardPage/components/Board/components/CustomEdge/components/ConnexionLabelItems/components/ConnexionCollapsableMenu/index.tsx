import DividerWrapper from '@/components/DividerWrapper'
import RichEditor from '@/components/RichEditor/index'
import StrongText from '@/components/StrongText'
import {
  IConnexion,
  IConnexionType,
  connexionConfig,
  connexionDirections,
} from '@/pages/BoardPage/components/Board/components/connexionContants'
import { CARD_WIDTH } from '@/pages/BoardPage/configs/constants'
import { handleUpdateEdge } from '@/pages/BoardPage/configs/helpers'
import {
  Accordion,
  Box,
  Center,
  Collapse,
  Divider,
  Group,
  Paper,
  Select,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { IconArrowsExchange, IconTrash } from '@tabler/icons-react'
import { Editor } from '@tiptap/react'
import { groupBy } from 'lodash'
import { ElementType } from 'react'
import { Edge, useReactFlow } from 'reactflow'

interface Props {
  handleDeleteEdge: () => void
  configIsOpen: boolean
  connexion: IConnexion
  editor: Editor | null
  collapseAll: boolean
}

function getNextDirection(
  currentColor: IConnexion['direction'],
): IConnexion['direction'] {
  const currentIndex = connexionDirections.indexOf(currentColor)
  const nextIndex = (currentIndex + 1) % connexionDirections.length
  return connexionDirections[nextIndex]
}

const connexionsByGroup = groupBy(connexionConfig, 'group')
const selectData = Object.entries(connexionsByGroup).map(
  ([group, listItem]) => {
    return {
      group,
      items: listItem.map(({ value, label }) => ({
        value,
        label,
      })),
    }
  },
)

export default function ConnexionCollapsableMenu({
  connexion,
  handleDeleteEdge,
  configIsOpen,
  collapseAll,
  editor,
}: Props) {
  const flowInstance = useReactFlow()

  return (
    <Collapse in={!collapseAll}>
      <Paper
        withBorder
        w={CARD_WIDTH + 12}
        style={{
          backgroundColor: !configIsOpen ? 'transparent' : '',
          borderColor: !configIsOpen ? 'transparent' : '',
        }}
      >
        <Collapse in={configIsOpen}>
          <Box p="xs" pt={0}>
            <DividerWrapper>
              <StrongText>Connexion parameters</StrongText>
            </DividerWrapper>
            <Accordion chevron={false} defaultValue="Apples">
              <LineItem
                Icon={IconArrowsExchange}
                onClick={() => {
                  const edge = flowInstance.getEdge(
                    connexion.id,
                  ) as Edge<IConnexion>
                  const nextDirection = getNextDirection(edge.data!.direction)
                  handleUpdateEdge(
                    connexion.id,
                    {
                      direction: nextDirection,
                    },
                    flowInstance,
                  )
                }}
                label="Switch direction"
              />

              <LineItem
                Icon={IconTrash}
                onClick={handleDeleteEdge}
                label="Remove connexion"
              />
            </Accordion>
            <Divider my="xs" />
            <Select
              variant="default"
              data={selectData}
              value={connexion.connexionType}
              placeholder="Add connexion type"
              allowDeselect
              onChange={(newConnexionType) => {
                handleUpdateEdge(
                  connexion.id,
                  {
                    connexionType: newConnexionType,
                  } as { connexionType: IConnexionType },
                  flowInstance,
                )
              }}
              renderOption={({ option: { label, value } }) => {
                const { Icon } = connexionConfig[value as IConnexionType]
                return (
                  <Group gap="xs">
                    <ThemeIcon size="lg" variant="light">
                      <Icon stroke={1} />
                    </ThemeIcon>
                    <Text fs="initial">{label}</Text>
                  </Group>
                )
              }}
            />
          </Box>
        </Collapse>
        <Center mb="xs">
          <RichEditor editor={editor} forceToolsOpen={configIsOpen} />
        </Center>
      </Paper>
    </Collapse>
  )
}

function LineItem({
  Icon,
  label,
  onClick,
}: {
  onClick: () => void
  label: string
  Icon: ElementType
}) {
  return (
    <Accordion.Item
      h={35}
      value="1"
      style={{ border: 'none', borderRadius: 4 }}
      onClick={onClick}
    >
      <Accordion.Control
        h={35}
        pr={0}
        icon={
          <ThemeIcon variant="transparent" size="xs" color="gray">
            <Icon />
          </ThemeIcon>
        }
      >
        {label}
      </Accordion.Control>
    </Accordion.Item>
  )
}
