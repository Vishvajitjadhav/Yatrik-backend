import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/** Shimmer placeholder for loading lists/cards (prefer over spinners for content). */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-line/70', className)}
      {...props}
    />
  )
}
