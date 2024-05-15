import { IEndpointData } from '@/pages/BoardPage/components/Board/constants'
import {
  ActionIcon,
  Box,
  CloseButton,
  Flex,
  Grid,
  Group,
  Kbd,
  Menu,
  TextInput,
} from '@mantine/core'
import { getHotkeyHandler, useDisclosure, useFocusWithin } from '@mantine/hooks'
import {
  IconEdit,
  IconHttpDelete,
  IconHttpGet,
  IconHttpPatch,
  IconHttpPost,
  IconHttpPut,
  IconTrash,
} from '@tabler/icons-react'
import { ReactNode } from 'react'

type IEndpointElement = IEndpointData['endpoints'][any]
interface Props {
  onAdressChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onMethodChange: (method: IEndpointElement['method']) => void
  endpointData: IEndpointElement
  onClickDelete: () => void
}

const methodConfig: Record<
  IEndpointData['endpoints'][any]['method'],
  { color: string; getComponent: (props: any) => ReactNode }
> = {
  GET: {
    color: 'var(--mantine-color-blue-6)',
    getComponent: (props: any) => <IconHttpGet {...props} />,
  },
  PUT: {
    color: 'var(--mantine-color-orange-6)',
    getComponent: (props: any) => <IconHttpPut {...props} />,
  },
  PATCH: {
    color: 'var(--mantine-color-green-4)',
    getComponent: (props: any) => <IconHttpPatch {...props} />,
  },
  POST: {
    color: 'var(--mantine-color-green-6)',
    getComponent: (props: any) => <IconHttpPost {...props} />,
  },
  DELETE: {
    color: 'var(--mantine-color-red-6)',
    getComponent: (props: any) => <IconHttpDelete {...props} />,
  },
}

export default function Endpoint({
  onAdressChange,
  endpointData,
  onClickDelete,
  onMethodChange,
}: Props) {
  const [showEditInput, { close: closeShowEdit, open: openShowEdit }] =
    useDisclosure(false)

  return (
    <Grid align="center">
      <Grid.Col span="content">
        <Menu width={62} position="right">
          <Menu.Target>
            <ActionIcon
              color={methodConfig[endpointData.method].color}
              variant="filled"
              aria-label="Settings"
            >
              {methodConfig[endpointData.method].getComponent({
                width: '70%',
                stroke: 1.5,
              })}
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            {Object.entries(methodConfig)
              .filter(([key]) => key !== endpointData.method)
              .map(([key, { color, getComponent }]) => (
                <Menu.Item key={key}>
                  <ActionIcon
                    onClick={() =>
                      onMethodChange(key as IEndpointElement['method'])
                    }
                    color={color}
                    variant="filled"
                    aria-label="Settings"
                  >
                    {getComponent({
                      width: '70%',
                      stroke: 1.5,
                    })}
                  </ActionIcon>
                </Menu.Item>
              ))}
          </Menu.Dropdown>
        </Menu>
      </Grid.Col>
      <Grid.Col span="auto">
        {showEditInput ? (
          <Input
            onClickValidate={closeShowEdit}
            value={endpointData.address}
            onChange={onAdressChange}
          />
        ) : (
          <NonInput
            onClickDelete={onClickDelete}
            address={endpointData.address}
            onClickEdit={openShowEdit}
          />
        )}
      </Grid.Col>
    </Grid>
  )
}

function NonInput({
  address,
  onClickEdit,
  onClickDelete,
}: {
  onClickEdit: () => void
  address: string
  onClickDelete: () => void
}) {
  const iconStyle = { width: '70%', height: '70%' }
  return (
    <Group gap="xs" justify="space-between">
      <Flex align="center" component="span" gap=".2rem">
        {address?.split('/').map((text) => (
          <>
            <Kbd>/</Kbd>
            <span onClick={onClickEdit}> {text}</span>
          </>
        ))}
      </Flex>

      <Box>
        <ActionIcon
          variant="transparent"
          color="grey" // todo color
          aria-label="Settings"
          onClick={onClickEdit}
        >
          <IconEdit style={iconStyle} stroke={1.5} />
        </ActionIcon>
        <CloseButton
          onClick={onClickDelete}
          icon={<IconTrash color="grey" style={iconStyle} stroke={1.5} />}
        />
      </Box>
    </Group>
  )
}

function Input({
  onChange,
  value,
  onClickValidate,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  onClickValidate: () => void
}) {
  const { ref } = useFocusWithin({
    onBlur: () => {
      onClickValidate()
    },
  })

  return (
    <div ref={ref}>
      <TextInput
        autoFocus
        onChange={onChange}
        value={value}
        size="xs"
        rightSection={
          <Kbd size="xs" mr="sm" onClick={onClickValidate}>
            Enter
          </Kbd>
        }
        aria-label="Endoint"
        onKeyDown={getHotkeyHandler([['Enter', onClickValidate]])}
      />
    </div>
  )
}
