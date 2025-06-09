import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useCallback, useInsertionEffect, useRef } from 'react'
import { TCustomEdge } from './pages/BoardPage/components/Board/components/connexionContants'
import { ICON_STYLE, TCustomNode } from './pages/BoardPage/configs/constants'

export const customColors = {
  primary: [
    '#f4ffde',
    '#e8ffbc',
    '#d6ff8f',
    '#c1ff59',
    '#aeff1a',
    '#9de000',
    '#8cc100',
    '#7fa700',
    '#738f00',
    '#667f00',
  ],
  primaryAlpha: [
    '#000', //emtpy shade0,
    '#00910002',
    '#9ff40009',
    '#c9fc1119',
    '#c9fd1827',
    '#cdfd2035',
    '#d1fe2f44',
    '#d5ff3b55',
    '#d9ff3d69',
    '#dcff46',
    '#dbfe39f5',
    '#dcfe51e4',
    '#ebfeb6f7',
  ],
  gray: [
    '#000', //emtpy shade0,
    '#101115',
    '#18191d',
    '#212228',
    '#282a30',
    '#2f3137',
    '#393a41',
    '#46484f',
    '#5f6168',
    '#6c6e76',
    '#7a7c83',
    '#b2b4bc',
    '#edeef2',
  ],
  grayAlpha: [
    '#000', //emtpy shade0,
    '#0012de05',
    '#9baefd0d',
    '#b5bffc19',
    '#becdfa22',
    '#ccd9fe29',
    '#d5dafc34',
    '#dae2fd43',
    '#e5eafd5e',
    '#e6ebfd6d',
    '#ebeffd7b',
    '#f0f3feb8',
    '#f9fafef2',
  ],
}

const colorPrimary = '#DCFF46'
export const themeDarkColorVariables = {
  '--border': customColors.gray[7],
  '--border-strong': customColors.gray[8],
  '--border-primary': customColors.primary[6],
  '--border-primary-strong': customColors.primary[8],
  '--surface': customColors.gray[3],
  '--surface-strong': customColors.gray[5],
  '--surface-primary': customColors.primary[3],
  '--surface-primary-strong': customColors.primary[5],
  '--background': customColors.gray[1],
  '--primary': colorPrimary,
  '--text': customColors.gray[11],
  '--text-strong': customColors.gray[12],
  '--text-primary': colorPrimary,
}

export const CSSVAR = Object.keys(themeDarkColorVariables).reduce(
  (acc, cur) => ({ ...acc, [cur]: `var(${cur})` }),
  {},
) as Record<keyof typeof themeDarkColorVariables, string>

export function getDataToStoreObject(
  nodes: TCustomNode[],
  edges: TCustomEdge[],
) {
  const dataToStore = { nodes, edges, timestamp: new Date() }

  return dataToStore
}

// UseEffectEvent polyfill
export function useEffectEventP<T extends (...args: any[]) => any>(
  fn: T,
): (...args: Parameters<T>) => ReturnType<T> {
  const ref = useRef<T>(fn)
  useInsertionEffect(() => {
    ref.current = fn
  }, [fn])

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    const f = ref.current
    return f(...args)
  }, [])
}

export function showNotificationError({
  title,
  message,
  autoClose = 8000,
}: {
  title?: string
  message?: string
  autoClose?: number
}) {
  notifications.show({
    icon: <IconX color="white" style={ICON_STYLE} />,
    message,
    color: 'red',
    title,
    autoClose,
  })
}

export function showNotificationSuccess({
  title,
  message,
  autoClose = 8000,
}: {
  title?: string
  message?: string
  autoClose?: number
}) {
  notifications.show({
    icon: <IconCheck color="white" style={ICON_STYLE} />,
    message,
    color: 'green',
    title,
    autoClose,
  })
}

// I inject the url during playwright tests with `__TEST_ENV__`
export const getApiUrl = () => {
  const url =
    (window as any).__TEST_ENV__.VITE_API_URL || import.meta.env.VITE_API_URL

  return url
}
