import { CSSVAR } from '@/contants'
import { motion } from 'motion/react'
import { SECTIONS } from '../../constants'

export default function Timeline({ selectedIndex }: { selectedIndex: number }) {
  const percentProgress = (selectedIndex / (SECTIONS.length - 1)) * 100
  return (
    <motion.div
      style={{
        width: 3,
        height: 210,
        backgroundColor: CSSVAR['--surface-strong'],
        position: 'relative',
      }}
    >
      <motion.div
        animate={{ height: `${percentProgress}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          width: 3,
          backgroundColor: CSSVAR['--primary'],
        }}
      />
      {SECTIONS.map((_, index) => (
        <Dot
          key={index}
          active={index === selectedIndex}
          verticalPercent={index * (1 / (SECTIONS.length - 1)) * 100}
          passed={index < selectedIndex}
        />
      ))}
    </motion.div>
  )
}

function Dot({
  active,
  verticalPercent,
  passed,
}: {
  active?: boolean
  passed?: boolean
  verticalPercent: number
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: `${verticalPercent}%`,
        left: '50%',
        width: 5,
        height: 5,
        borderRadius: 20,
        backgroundColor: active
          ? CSSVAR['--text-primary']
          : passed
          ? CSSVAR['--text-primary']
          : CSSVAR['--text'],

        transform: 'translateY(-50%) translateX(-50%)',
        transition: 'background-color 0.4s',
      }}
    />
  )
}
