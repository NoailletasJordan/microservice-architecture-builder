import TooltipWrapper from '@/components/TooltipWrapper'
import { CSSVAR } from '@/contants'
import { NO_DRAG_REACTFLOW_CLASS } from '@/pages/BoardPage/configs/constants'
import { handleDeleteNode } from '@/pages/BoardPage/configs/helpers'
import { ActionIcon, Group } from '@mantine/core'
import { IconNote } from '@tabler/icons-react'
import { motion, Variants } from 'motion/react'
import { ReactNode } from 'react'
import { NodeToolbar, ReactFlowInstance } from 'reactflow'
import DeleteButton from '../DeleteButton'

interface Props {
  parentId: string
  children: ReactNode
  flowInstance: ReactFlowInstance<any, any>
  isHovered: boolean
  setIsHovered: (hovered: boolean) => void
}

export default function ServiceActionsWrapper({
  flowInstance,
  parentId,
  children,
  isHovered,
  setIsHovered,
}: Props) {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      transitionEnd: { display: 'none' },
      transition: { delay: 0.2, duration: 0.2, ease: 'easeOut' },
    },
    visible: {
      opacity: 1,
      display: 'block',
      transition: { delay: 0.2, duration: 0.2, ease: 'easeOut' },
    },
  }

  return (
    <>
      <NodeToolbar isVisible>
        <motion.div
          variants={variants}
          initial={false}
          animate={isHovered ? 'visible' : 'hidden'}
          className={NO_DRAG_REACTFLOW_CLASS}
        >
          <Group
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            px="0.4rem"
            py="0.2rem"
            gap="sm"
            style={(theme) => ({
              borderRadius: theme.radius.md,
            })}
            align="center"
            bg={CSSVAR['--surface']}
          >
            <TooltipWrapper label="Add a note">
              <ActionIcon
                variant="outline"
                style={{ border: 'none' }}
                color={CSSVAR['--text']}
                size="md"
              >
                <IconNote stroke={1.5} />
              </ActionIcon>
            </TooltipWrapper>
            <DeleteButton
              parentId={parentId}
              onClick={() => handleDeleteNode(parentId, flowInstance)}
            />
          </Group>
        </motion.div>
      </NodeToolbar>
      {children}
    </>
  )
}
