import * as React from 'react'

import { cn } from '../../lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('rounded-[26px] border border-white/10 bg-[#17131f]/88 text-[#f8f6ff]', className)} {...props} />
}

export { Card }
