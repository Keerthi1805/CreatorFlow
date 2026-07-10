import { requireCreator } from '@/lib/auth'
import { CreatorSidebar } from '@/components/creator/sidebar'
import { CreatorHeader } from '@/components/creator/header'

export default async function CreatorLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireCreator()
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <CreatorSidebar profile={profile} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CreatorHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
