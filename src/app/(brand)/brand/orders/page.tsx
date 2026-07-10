import { requireBrand } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, getOrderStatusColor, ORDER_STATUS_LABELS } from '@/utils'
import Link from 'next/link'
import { Plus } from 'lucide-react'
export default async function BrandOrders() {
  const { profile } = await requireBrand()
  const orders = await prisma.order.findMany({ where:{brandId:profile.id}, include:{creator:true,samples:{take:1,orderBy:{requestedAt:'desc'}},shipments:{take:1,orderBy:{createdAt:'desc'}}}, orderBy:{createdAt:'desc'} })
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-900">Orders</h1><p className="text-sm text-gray-500">{orders.length} total orders</p></div>
        <Link href="/brand/orders/new" className="h-10 px-4 bg-emerald-600 text-white text-sm rounded-lg font-semibold hover:bg-emerald-700 flex items-center gap-2"><Plus className="w-4 h-4"/>Place Order</Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Order #</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Creator</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Amount</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Deadline</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Sample</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Action</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length===0?<tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No orders yet. <Link href="/brand/orders/new" className="text-emerald-600 hover:underline">Place your first order</Link></td></tr>
              :orders.map(order=>(
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3"><Link href={`/brand/orders/${order.id}`} className="text-emerald-600 hover:underline font-mono text-xs">{order.orderNumber}</Link></td>
                <td className="px-4 py-3 font-medium text-gray-900">{order.creator.businessName}</td>
                <td className="px-4 py-3 font-semibold">{formatCurrency(order.totalAmount)}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{order.deliveryDeadline?formatDate(order.deliveryDeadline):'—'}</td>
                <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getOrderStatusColor(order.status)}`}>{ORDER_STATUS_LABELS[order.status]}</span></td>
                <td className="px-4 py-3">{order.samples[0]?<span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${order.samples[0].status==='APPROVED'?'bg-green-100 text-green-700':order.samples[0].status==='UPLOADED'?'bg-blue-100 text-blue-700':'bg-gray-100 text-gray-500'}`}>{order.samples[0].status}</span>:<span className="text-[10px] text-gray-300">—</span>}</td>
                <td className="px-4 py-3"><Link href={`/brand/orders/${order.id}`} className="text-xs text-emerald-600 hover:underline">View →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
