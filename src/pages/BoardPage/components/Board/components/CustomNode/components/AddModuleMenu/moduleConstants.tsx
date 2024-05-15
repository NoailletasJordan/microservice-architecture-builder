import { IconApi, IconMarkdown } from '@tabler/icons-react'
import { v4 } from 'uuid'
import { Module } from '../../../../constants'

export type ModuleType = 'markdown' | 'endpoints'
export type ModuleConfigData = {
  label: string
  icon: JSX.Element
  getNew: (parentId: Module['id']) => Module
}

const ICON_STROKE = 1.5
export const moduleConfig: Record<ModuleType, ModuleConfigData> = {
  markdown: {
    label: 'Note',
    icon: <IconMarkdown size="md" stroke={ICON_STROKE} />,
    getNew: (parentId) => {
      return {
        id: v4(),
        data: { text: '' },
        moduleType: 'markdown',
        parentId,
      }
    },
  },
  endpoints: {
    label: 'Endpoints',
    icon: <IconApi size="md" stroke={ICON_STROKE} />,
    getNew: (parentId) => {
      return {
        id: v4(),
        data: { endpoints: [{ address: 'users', method: 'GET' }] },
        moduleType: 'endpoints',
        parentId,
      }
    },
  },
}
