import { IconMarkdown } from '@tabler/icons-react'
import { v4 } from 'uuid'
import { Module } from '../../../../constants'

export type ModuleType = 'markdown'
export type ModuleConfigData = {
  label: string
  icon: JSX.Element
  getNew: () => Module
}
export const moduleConfig: Record<ModuleType, ModuleConfigData> = {
  markdown: {
    label: 'Markdown',
    icon: <IconMarkdown size="md" stroke={1.5} />,
    getNew: () => {
      return {
        id: v4(),
        data: {},
        moduleType: 'markdown',
      }
    },
  },
}
