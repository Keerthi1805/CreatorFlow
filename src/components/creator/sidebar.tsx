'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Package, HandshakeIcon, IndianRupee, Truck, User, Plus, Search } from 'lucide-react'
import { cn } from '@/utils'
import { useQuery } from '@tanstack/react-query'

const nav = [
  { href: '/creator/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/creator/discover', icon: Search, label: 'Discover Brands' },
  { href: '/creator/requests', icon: HandshakeIcon, label: 'Requests', countKey: 'pendingRequests' },
  { href: '/creator/orders', icon: ShoppingBag, label: 'Orders', countKey: 'activeOrders' },
  { href: '/creator/products', icon: Package, label: 'My Products' },
  { href: '/creator/shipments', icon: Truck, label: 'Shipments' },
  { href: '/creator/earnings', icon: IndianRupee, label: 'Earnings' },
  { href: '/creator/profile', icon: User, label: 'Profile' },
]

export function CreatorSidebar({ profile }: { profile: any }) {
  const pathname = usePathname()
  const { data } = useQuery({
    queryKey: ['creator-dashboard'],
    queryFn: async () => { const r = await fetch('/api/creator/dashboard'); return r.json() },
    refetchInterval: 30000,
  })
  const stats = data?.data?.stats ?? {}

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{profile.businessName?.[0] ?? 'C'}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">{profile.businessName}</p>
            <p className="text-[10px] text-indigo-600 font-medium">Creator Portal</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <Link href="/creator/products/new">
          <div className="flex items-center gap-2 px-3 py-2 mb-3 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Product
          </div>
        </Link>
        {nav.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const count = item.countKey ? (stats[item.countKey] ?? 0) : 0
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn('flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors', isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50')}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {count > 0 && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">{count}</span>}
              </div>
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <Link href="/creator/profile" className="flex items-center gap-2 px-2 hover:bg-gray-50 rounded-lg py-1">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-700 text-xs font-bold">{profile.ownerName?.[0] ?? 'C'}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{profile.ownerName}</p>
            <p className="text-[10px] text-gray-500">{profile.city}</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
