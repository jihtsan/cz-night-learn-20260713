import * as React from 'react'

import { cn } from '../../lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full min-w-0 rounded-md border border-white/10 bg-white/[0.04] px-3 py-1 text-base text-white shadow-sm outline-none transition-[color,box-shadow] placeholder:text-white/35 focus-visible:ring-2 focus-visible:ring-[#a855f7]/45 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
