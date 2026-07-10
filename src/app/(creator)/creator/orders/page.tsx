import { requireCreator } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, getOrderStatusColor, ORDER_STATUS_LABELS } from '@/utils'
import Link from 'next/link'
export default async function CreatorOrders() {
  const { profile } = await requireCreator()
  const orders = await prisma.order.findMany({ where: { creatorId: profile.id }, include: { brand: true, items: true, shipments: { take:1,orderBy:{createdAt:'desc'} }, payments: true }, orderBy: { createdAt: 'desc' } })
  return (
    <div className="space-y-5 animate-fade-in">
      <div><h1 className="text-xl font-bold text-gray-900">My Orders</h1><p className="text-sm text-gray-500">{orders.length} total orders</p></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Order</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Brand</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Amount</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Deadline</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Payment</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No orders yet</td></tr>
              : orders.map(o => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><Link href={`/creator/orders/${o.id}`} className="text-indigo-600 hover:underline font-mono text-xs">{o.orderNumber}</Link></td>
                <td className="px-4 py-3 font-medium text-gray-900">{o.brand.companyName}</td>
                <td className="px-4 py-3 font-semibold">{formatCurrency(o.totalAmount)}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{o.deliveryDeadline ? formatDate(o.deliveryDeadline) : '—'}</td>
                <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getOrderStatusColor(o.status)}`}>{ORDER_STATUS_LABELS[o.status]}</span></td>
                <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${o.paymentStatus==='PAID'?'bg-green-100 text-green-700':o.paymentStatus==='ADVANCE_PAID'?'bg-blue-100 text-blue-700':'bg-amber-100 text-amber-700'}`}>{o.paymentStatus.replace(/_/g,' ')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
