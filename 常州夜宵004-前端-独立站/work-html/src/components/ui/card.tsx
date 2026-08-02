import * as React from 'react'

import { cn } from '../../lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('rounded-[30px] border bg-white text-[#1d1d1f]', className)} {...props} />
}

export { Card }
