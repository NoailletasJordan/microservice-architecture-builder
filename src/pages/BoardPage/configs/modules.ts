import { v4 } from 'uuid'
import IconCustomNote from '../../../components/IconsCustom/IconCustomNote'
import { Module } from './constants'

export type ModuleType = 'markdown'
export type ModuleConfigData = {
  label: string
  Icon: JSX.ElementType
  getNew: (parentId: Module['id']) => Module
  disabled?: boolean
}

export const moduleConfig: Record<ModuleType, ModuleConfigData> = {
  markdown: {
    label: 'Note',
    Icon: IconCustomNote,
    getNew: (parentId) => {
      return {
        id: v4(),
        data: { text: '' },
        moduleType: 'markdown',
        isVisible: true,
        parentId,
      }
    },
  },
}
