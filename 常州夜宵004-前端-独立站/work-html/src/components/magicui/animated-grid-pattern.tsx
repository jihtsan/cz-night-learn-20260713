import { motion } from 'motion/react'

import { cn } from '../../lib/utils'

type AnimatedGridPatternProps = {
  className?: string
}

const animatedCells = [
  { x: 2, y: 1, delay: 0.2 },
  { x: 7, y: 3, delay: 1.1 },
  { x: 12, y: 2, delay: 2.1 },
  { x: 16, y: 6, delay: 0.7 },
  { x: 4, y: 8, delay: 2.8 },
  { x: 10, y: 10, delay: 1.7 },
  { x: 18, y: 12, delay: 3.2 },
]

// Visual treatment adapted from Magic UI's Animated Grid Pattern component.
function AnimatedGridPattern({ className }: AnimatedGridPatternProps) {
  return (
    <svg className={cn('fill-[#a5adc0]/10 stroke-[#8b94a8]/15', className)} aria-hidden="true">
      <defs>
        <pattern id="navigation-grid" width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M 56 0 L 0 0 0 56" fill="none" strokeWidth="0.7" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#navigation-grid)" />
      {animatedCells.map((cell) => (
        <motion.rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x * 56 + 1}
          y={cell.y * 56 + 1}
          width="54"
          height="54"
          strokeWidth="0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{ duration: 4.8, delay: cell.delay, repeat: Infinity, repeatDelay: 1.2 }}
        />
      ))}
    </svg>
  )
}

export { AnimatedGridPattern }
