import * as React from 'react'

import { cn } from '../../lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full min-w-0 rounded-md border border-[#dcdce0] bg-white px-3 py-1 text-base text-[#1d1d1f] shadow-sm outline-none transition-[color,box-shadow] placeholder:text-[#9c9ca1] focus-visible:ring-2 focus-visible:ring-[#7aa5ff]/45 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
