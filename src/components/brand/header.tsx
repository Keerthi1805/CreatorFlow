'use client'
import { UserButton } from '@clerk/nextjs'
import { NotificationsBell } from '@/components/shared/notifications-bell'
export function BrandHeader({ user }: { user: any }) {
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6 gap-4 flex-shrink-0">
      <div className="flex-1" />
      <NotificationsBell />
      <UserButton afterSignOutUrl="/sign-in" />
    </header>
  )
}
