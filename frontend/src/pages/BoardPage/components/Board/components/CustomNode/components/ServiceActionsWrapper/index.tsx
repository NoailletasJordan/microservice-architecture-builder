import TooltipWrapper from '@/components/TooltipWrapper'
import { CSSVAR } from '@/contants'
import { NO_DRAG_REACTFLOW_CLASS } from '@/pages/BoardPage/configs/constants'
import { getStateAfterDeleteNode } from '@/pages/BoardPage/configs/helpers'
import { ActionIcon, Group } from '@mantine/core'
import { IconNote, IconTrash } from '@tabler/icons-react'
import { motion, Variants } from 'motion/react'
import { ReactNode } from 'react'
import { NodeToolbar, ReactFlowInstance } from 'reactflow'

interface Props {
  parentId: string
  children: ReactNode
  flowInstance: ReactFlowInstance<any, any>
  isHovered: boolean
  setIsHovered: (hovered: boolean) => void
  handleActionClick: () => void
}

export default function ServiceActionsWrapper({
  flowInstance,
  parentId,
  children,
  isHovered,
  setIsHovered,
  handleActionClick,
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
            color={CSSVAR['--text']}
          >
            <TooltipWrapper label="Add a note">
              <ActionIcon
                aria-label="Add a note"
                onClick={handleActionClick}
                variant="outline"
                style={{ border: 'none' }}
                color={CSSVAR['--text']}
                size="md"
              >
                <IconNote stroke={1.5} />
              </ActionIcon>
            </TooltipWrapper>
            <TooltipWrapper label="Delete the service">
              <ActionIcon
                data-testid={`node-delete-${parentId}`}
                size="md"
                variant="outline"
                style={{ border: 'none' }}
                color={CSSVAR['--text']}
                onClick={() => {
                  const currentEdges = flowInstance.getEdges()
                  const currentNodes = flowInstance.getNodes()
                  const { nodes: nodesAfterDelete, edges: edgesAfterDelete } =
                    getStateAfterDeleteNode({
                      nodeId: parentId,
                      currentEdges,
                      currentNodes,
                    })
                  flowInstance.setNodes(nodesAfterDelete)
                  flowInstance.setEdges(edgesAfterDelete)
                }}
              >
                <IconTrash stroke={1.5} />
              </ActionIcon>
            </TooltipWrapper>
          </Group>
        </motion.div>
      </NodeToolbar>
      {children}
    </>
  )
}
