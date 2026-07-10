import { requireBrand } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, getOrderStatusColor, ORDER_STATUS_LABELS } from '@/utils'
import { ShoppingBag, Users, Package, Truck, CheckCircle2, CreditCard, Bell, AlertCircle, Search } from 'lucide-react'
import Link from 'next/link'
export default async function BrandDashboard() {
  const { user, profile } = await requireBrand()
  const [orders, pendingCollabs, notifications] = await Promise.all([
    prisma.order.findMany({ where:{brandId:profile.id}, include:{creator:true,shipments:{take:1,orderBy:{createdAt:'desc'}}}, orderBy:{createdAt:'desc'} }),
    prisma.collabRequest.count({ where:{brandId:profile.id,status:'PENDING'} }),
    prisma.notification.findMany({ where:{userId:user.id,isRead:false}, orderBy:{createdAt:'desc'}, take:8 }),
  ])
  const inProd=orders.filter(o=>['IN_PRODUCTION','PRODUCTION_25','PRODUCTION_50','PRODUCTION_75','PRODUCTION_COMPLETE','QUALITY_CHECK','PACKAGING'].includes(o.status))
  const samplePending=orders.filter(o=>['SAMPLE_REQUESTED','SAMPLE_UPLOADED'].includes(o.status))
  const completed=orders.filter(o=>o.status==='COMPLETED')
  const pendingPay=orders.reduce((s,o)=>s+(o.finalAmount-o.finalPaid),0)
  const now=new Date()
  const monthSpend=orders.filter(o=>{const d=new Date(o.createdAt);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear()}).reduce((s,o)=>s+o.totalAmount,0)
  const stats=[
    {label:'Total Orders',value:orders.length,icon:ShoppingBag,color:'bg-emerald-50 text-emerald-600',border:'border-emerald-100'},
    {label:'In Production',value:inProd.length,icon:Package,color:'bg-indigo-50 text-indigo-600',border:'border-indigo-100'},
    {label:'Sample Review',value:samplePending.length,icon:AlertCircle,color:'bg-amber-50 text-amber-600',border:'border-amber-100',alert:samplePending.length>0},
    {label:'In Transit',value:orders.filter(o=>o.status==='SHIPPED').length,icon:Truck,color:'bg-blue-50 text-blue-600',border:'border-blue-100'},
    {label:'Completed',value:completed.length,icon:CheckCircle2,color:'bg-green-50 text-green-600',border:'border-green-100'},
    {label:'Active Creators',value:profile.activeCreators,icon:Users,color:'bg-purple-50 text-purple-600',border:'border-purple-100'},
    {label:'This Month Spend',value:formatCurrency(monthSpend),icon:CreditCard,color:'bg-rose-50 text-rose-600',border:'border-rose-100'},
    {label:'Pending Payments',value:formatCurrency(pendingPay),icon:CreditCard,color:'bg-amber-50 text-amber-600',border:'border-amber-100'},
  ]
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-900">Welcome back, {profile.contactPerson.split(' ')[0]} 👋</h1><p className="text-sm text-gray-500">{profile.companyName}</p></div>
        <Link href="/brand/discover" className="h-10 px-4 bg-emerald-600 text-white text-sm rounded-lg font-semibold hover:bg-emerald-700 flex items-center gap-2"><Search className="w-4 h-4"/>Find Creators</Link>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s=>(
          <div key={s.label} className={`bg-white rounded-xl border ${s.border} p-4 shadow-soft relative`}>
            {s.alert&&<span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse"/>}
            <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-4 h-4"/></div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-soft">
          <div className="flex items-center justify-between p-4 border-b border-gray-100"><h2 className="text-sm font-semibold">Recent Orders</h2><Link href="/brand/orders" className="text-xs text-emerald-600 hover:underline">View all</Link></div>
          <div className="divide-y divide-gray-50">
            {orders.length===0?<div className="p-8 text-center"><ShoppingBag className="w-8 h-8 text-gray-200 mx-auto mb-2"/><p className="text-sm text-gray-400 mb-3">No orders yet</p><Link href="/brand/orders/new" className="text-xs text-emerald-600 hover:underline">Place your first order →</Link></div>
              :orders.slice(0,6).map(order=>(
              <Link key={order.id} href={`/brand/orders/${order.id}`}>
                <div className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-xs font-bold text-emerald-600 flex-shrink-0">{order.creator.businessName[0]}</div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium">{order.orderNumber}</p><p className="text-xs text-gray-500">{order.creator.businessName}</p></div>
                  <div className="text-right flex-shrink-0"><span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getOrderStatusColor(order.status)}`}>{ORDER_STATUS_LABELS[order.status]}</span><p className="text-xs font-semibold mt-1">{formatCurrency(order.totalAmount)}</p></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {samplePending.length>0&&(
            <div className="bg-amber-50 rounded-xl border border-amber-100 shadow-soft p-4">
              <h2 className="text-sm font-semibold text-amber-800 mb-2">⚠️ Samples Awaiting Review</h2>
              {samplePending.map(o=><Link key={o.id} href={`/brand/orders/${o.id}`}><div className="py-2 border-b border-amber-100 last:border-0 hover:opacity-80"><p className="text-xs font-medium text-amber-900">{o.orderNumber}</p><p className="text-[10px] text-amber-600">{o.creator.businessName}</p></div></Link>)}
            </div>
          )}
          <div className="bg-white rounded-xl border border-gray-100 shadow-soft">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2"><Bell className="w-4 h-4 text-gray-400"/><h2 className="text-sm font-semibold">Notifications</h2>{notifications.length>0&&<span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold ml-auto">{notifications.length}</span>}</div>
            <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {notifications.length===0?<p className="text-xs text-gray-400 text-center py-6">All caught up!</p>
                :notifications.map(n=><div key={n.id} className="p-3"><p className="text-xs font-medium text-gray-900">{n.title}</p><p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{n.message}</p></div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
