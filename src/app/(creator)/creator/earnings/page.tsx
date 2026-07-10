import { requireCreator } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/utils'
import { IndianRupee, TrendingUp, Clock } from 'lucide-react'
export default async function CreatorEarnings() {
  const { profile } = await requireCreator()
  const orders = await prisma.order.findMany({ where: { creatorId: profile.id }, include: { brand: true, payments: { orderBy: { createdAt: 'desc' } } }, orderBy: { createdAt: 'desc' } })
  const totalEarned = orders.reduce((s,o)=>s+o.advancePaid+o.finalPaid,0)
  const pending = orders.reduce((s,o)=>s+(o.finalAmount-o.finalPaid),0)
  const now = new Date()
  const monthEarned = orders.filter(o=>{const d=new Date(o.createdAt);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear()}).reduce((s,o)=>s+o.advancePaid+o.finalPaid,0)
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-xl font-bold text-gray-900">Earnings</h1><p className="text-sm text-gray-500">Track all your payments and revenue</p></div>
      <div className="grid grid-cols-3 gap-4">
        {[{label:'Total Revenue',value:formatCurrency(totalEarned),icon:IndianRupee,color:'bg-emerald-50 text-emerald-600',border:'border-emerald-100'},{label:'This Month',value:formatCurrency(monthEarned),icon:TrendingUp,color:'bg-indigo-50 text-indigo-600',border:'border-indigo-100'},{label:'Pending',value:formatCurrency(pending),icon:Clock,color:'bg-amber-50 text-amber-600',border:'border-amber-100'}].map(s=>(
          <div key={s.label} className={`bg-white rounded-xl border ${s.border} shadow-soft p-5`}>
            <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-4 h-4" /></div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p><p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-gray-100"><h2 className="text-sm font-semibold">Payment History</h2></div>
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-100"><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Order</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Brand</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Type</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Amount</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Date</th></tr></thead>
          <tbody className="divide-y divide-gray-50">
            {orders.flatMap(o=>o.payments.map(p=>({...p,order:o}))).length===0?<tr><td colSpan={5} className="text-center py-10 text-gray-400 text-sm">No payments yet</td></tr>
              :orders.flatMap(o=>o.payments.map(p=>(
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.orderNumber}</td>
                <td className="px-4 py-3 font-medium">{o.brand.companyName}</td>
                <td className="px-4 py-3"><span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.type}</span></td>
                <td className="px-4 py-3 font-semibold text-emerald-600">{formatCurrency(p.amount)}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{p.paidAt?formatDate(p.paidAt):'—'}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
