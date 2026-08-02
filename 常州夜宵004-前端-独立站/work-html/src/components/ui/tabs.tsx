import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '../../lib/utils'

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn('flex flex-col gap-2', className)} {...props} />
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cn('inline-flex items-center', className)} {...props} />
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap text-[#77777c] transition-all hover:text-[#1d1d1f] data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-[#1d1d1f] data-[state=active]:shadow-[0_2px_8px_rgba(30,30,35,.08)]',
        className,
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger }
