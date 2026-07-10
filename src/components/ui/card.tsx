import * as React from 'react'
import { cn } from '@/utils'
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('rounded-xl border border-gray-100 bg-white shadow-soft', className)} {...props} />
))
Card.displayName = 'Card'
const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('flex flex-col space-y-1.5 p-5', className)} {...props} />
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => <h3 ref={ref} className={cn('text-sm font-semibold text-gray-900', className)} {...props} />)
CardTitle.displayName = 'CardTitle'
const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('p-5 pt-0', className)} {...props} />
export { Card, CardHeader, CardTitle, CardContent }
