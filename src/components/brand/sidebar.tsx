'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Search, ShoppingBag, FileText, Warehouse, CreditCard, User, Plus, HandshakeIcon } from 'lucide-react'
import { cn } from '@/utils'
import { useQuery } from '@tanstack/react-query'

const nav = [
  { href: '/brand/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/brand/discover', icon: Search, label: 'Discover Creators' },
  { href: '/brand/requests', icon: HandshakeIcon, label: 'Requests', countKey: 'pendingCollabs' },
  { href: '/brand/orders', icon: ShoppingBag, label: 'Orders', countKey: 'samplePending' },
  { href: '/brand/warehouses', icon: Warehouse, label: 'Warehouses' },
  { href: '/brand/payments', icon: CreditCard, label: 'Payments' },
  { href: '/brand/contracts', icon: FileText, label: 'Contracts' },
  { href: '/brand/profile', icon: User, label: 'Profile' },
]

export function BrandSidebar({ profile }: { profile: any }) {
  const pathname = usePathname()
  const { data } = useQuery({
    queryKey: ['brand-dashboard'],
    queryFn: async () => { const r = await fetch('/api/brands/dashboard'); return r.json() },
    refetchInterval: 30000,
  })
  const stats = data?.data?.stats ?? {}

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{profile.companyName?.[0] ?? 'B'}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">{profile.companyName}</p>
            <p className="text-[10px] text-emerald-600 font-medium">Brand Portal</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <Link href="/brand/orders/new">
          <div className="flex items-center gap-2 px-3 py-2 mb-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Place Order
          </div>
        </Link>
        {nav.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const count = item.countKey ? (stats[item.countKey] ?? 0) : 0
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn('flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors', isActive ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50')}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {count > 0 && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">{count}</span>}
              </div>
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <Link href="/brand/profile" className="flex items-center gap-2 px-2 hover:bg-gray-50 rounded-lg py-1">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-emerald-700 text-xs font-bold">{profile.contactPerson?.[0] ?? 'B'}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{profile.contactPerson}</p>
            <p className="text-[10px] text-gray-500">{profile.companyName}</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
