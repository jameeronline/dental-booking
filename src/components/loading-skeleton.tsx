'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function ServiceCardSkeleton() {
  return (
    <div className="p-4 rounded-lg border border-input">
      <div className="flex justify-between items-start mb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="w-5 h-5 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-3" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  )
}

export function DentistCardSkeleton() {
  return (
    <Card className="h-full">
      <div className="h-48 bg-muted" />
      <CardContent className="p-6">
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  )
}

export function DentistListItemSkeleton() {
  return (
    <div className="p-6 rounded-lg border border-input flex items-center gap-4">
      <Skeleton className="w-16 h-16 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-6 w-24" />
    </div>
  )
}

export function TimeSlotSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[...Array(9)].map((_, i) => (
        <Skeleton key={i} className="h-10 rounded-lg" />
      ))}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex gap-4 p-4 border-b">
      {[...Array(columns)].map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  )
}

export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}