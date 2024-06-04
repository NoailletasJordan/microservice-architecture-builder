import { Module } from '@/pages/BoardPage/configs/constants'
import { ModuleType } from '@/pages/BoardPage/configs/modules'
import { ReactNode } from 'react'
import ModuleRichTextEditor from './components/ModuleRichTextEditor'

interface Props {
  module: Module
}

const getContentComponent: Record<ModuleType, (props: any) => ReactNode> = {
  markdown: (props) => <ModuleRichTextEditor {...props} />,
}

export default function ModuleComponent({ module }: Props) {
  const moduleContent = getContentComponent[module.moduleType]({
    key: module.id,
    module,
  })

  return moduleContent
}
