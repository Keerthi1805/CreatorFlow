import { requireBrand } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate, formatCurrency } from '@/utils'
import { FileText } from 'lucide-react'
export default async function BrandContracts() {
  const { profile } = await requireBrand()
  const contracts = await prisma.contract.findMany({ where:{brandId:profile.id}, orderBy:{createdAt:'desc'} })
  const STATUS_COLOR:Record<string,string>={DRAFT:'bg-gray-100 text-gray-600',SENT:'bg-blue-100 text-blue-700',SIGNED:'bg-green-100 text-green-700',EXPIRED:'bg-red-100 text-red-700',CANCELLED:'bg-gray-100 text-gray-400'}
  return (
    <div className="space-y-5 animate-fade-in">
      <div><h1 className="text-xl font-bold text-gray-900">Contracts</h1><p className="text-sm text-gray-500">{contracts.length} contracts</p></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-100"><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Title</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Value</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Signed</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Expiry</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-50">
            {contracts.length===0?<tr><td colSpan={5} className="text-center py-12"><FileText className="w-8 h-8 text-gray-200 mx-auto mb-2"/><p className="text-gray-400 text-sm">No contracts yet</p></td></tr>
              :contracts.map(c=>(
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.title}</td>
                <td className="px-4 py-3">{c.value?formatCurrency(c.value):'—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{c.signedAt?formatDate(c.signedAt):'—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{c.expiryDate?formatDate(c.expiryDate):'—'}</td>
                <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${STATUS_COLOR[c.status]??'bg-gray-100 text-gray-500'}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
