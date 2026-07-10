import { requireCreator } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, getOrderStatusColor, ORDER_STATUS_LABELS } from '@/utils'
import { IndianRupee, ShoppingBag, Clock, CheckCircle2, Truck, Star, AlertCircle, Package } from 'lucide-react'
import Link from 'next/link'

export default async function CreatorDashboard() {
  const { user, profile } = await requireCreator()
  const [orders, pendingRequests, notifications] = await Promise.all([
    prisma.order.findMany({ where: { creatorId: profile.id }, include: { brand: true, payments: true }, orderBy: { createdAt: 'desc' } }),
    prisma.collabRequest.findMany({ where: { creatorId: profile.id, status: 'PENDING', initiatedBy: 'BRAND' }, include: { brand: { include: { user: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.notification.findMany({ where: { userId: user.id, isRead: false }, orderBy: { createdAt: 'desc' }, take: 8 }),
  ])
  const active = orders.filter(o => !['COMPLETED','CANCELLED','DELIVERED'].includes(o.status))
  const inProd = orders.filter(o => ['IN_PRODUCTION','PRODUCTION_25','PRODUCTION_50','PRODUCTION_75','PRODUCTION_COMPLETE','QUALITY_CHECK','PACKAGING'].includes(o.status))
  const completed = orders.filter(o => o.status === 'COMPLETED')
  const pendingPay = orders.reduce((s, o) => s + (o.finalAmount - o.finalPaid), 0)

  const stats = [
    { label: 'Active Orders', value: active.length, icon: ShoppingBag, color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100' },
    { label: 'Pending Requests', value: pendingRequests.length, icon: Clock, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100', alert: pendingRequests.length > 0 },
    { label: 'In Production', value: inProd.length, icon: Package, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { label: 'Completed', value: completed.length, icon: CheckCircle2, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
    { label: 'Total Revenue', value: formatCurrency(profile.totalRevenue), icon: IndianRupee, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
    { label: 'Pending Payment', value: formatCurrency(pendingPay), icon: AlertCircle, color: 'bg-red-50 text-red-600', border: 'border-red-100' },
    { label: 'Rating', value: `${profile.rating.toFixed(1)} ★`, icon: Star, color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-100' },
    { label: 'Ready to Ship', value: orders.filter(o => o.status === 'READY_TO_SHIP').length, icon: Truck, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Welcome back, {profile.ownerName.split(' ')[0]} 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">{profile.businessName} · {profile.city}, {profile.state}</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`bg-white rounded-xl border ${s.border} p-4 shadow-soft relative`}>
            {s.alert && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-4 h-4" /></div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-soft">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Active Orders</h2>
            <Link href="/creator/orders" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {active.length === 0 ? (
              <div className="p-8 text-center"><ShoppingBag className="w-8 h-8 text-gray-200 mx-auto mb-2" /><p className="text-sm text-gray-400">No active orders yet</p></div>
            ) : active.slice(0, 5).map(order => (
              <Link key={order.id} href={`/creator/orders/${order.id}`}>
                <div className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">{order.brand.companyName[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.brand.companyName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getOrderStatusColor(order.status)}`}>{ORDER_STATUS_LABELS[order.status]}</span>
                    <p className="text-xs font-semibold text-gray-900 mt-1">{formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {pendingRequests.length > 0 && (
            <div className="bg-white rounded-xl border border-amber-100 shadow-soft">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">New Requests</h2>
                <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">{pendingRequests.length}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {pendingRequests.slice(0, 3).map(req => (
                  <Link key={req.id} href="/creator/requests">
                    <div className="p-3 hover:bg-gray-50">
                      <p className="text-xs font-semibold text-gray-900">{req.brand.companyName}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{req.message}</p>
                      {req.expectedRevenue && <p className="text-[10px] text-emerald-600 font-semibold mt-1">Expected: {formatCurrency(req.expectedRevenue)}</p>}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="p-3 border-t border-gray-100">
                <Link href="/creator/requests" className="text-xs text-indigo-600 hover:underline">View all →</Link>
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl border border-gray-100 shadow-soft">
            <div className="p-4 border-b border-gray-100"><h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2></div>
            <div className="divide-y divide-gray-50">
              {notifications.length === 0 ? <p className="text-xs text-gray-400 text-center py-6">All caught up!</p>
                : notifications.slice(0, 5).map(n => (
                  <div key={n.id} className="p-3">
                    <p className="text-xs font-medium text-gray-900">{n.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
