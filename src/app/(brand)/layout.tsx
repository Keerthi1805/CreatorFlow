import { requireBrand } from '@/lib/auth'
import { BrandSidebar } from '@/components/brand/sidebar'
import { BrandHeader } from '@/components/brand/header'

export default async function BrandLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireBrand()
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <BrandSidebar profile={profile} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <BrandHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
