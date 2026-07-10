import { requireCreator } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/utils'
import Link from 'next/link'
import { Plus, Package } from 'lucide-react'
export default async function CreatorProducts() {
  const { profile } = await requireCreator()
  const products = await prisma.product.findMany({ where: { creatorId: profile.id, isActive: true }, orderBy: { createdAt: 'desc' } })
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-900">My Products</h1><p className="text-sm text-gray-500">{products.length} products</p></div>
        <Link href="/creator/products/new" className="h-10 px-4 bg-indigo-600 text-white text-sm rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</Link>
      </div>
      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-16 text-center">
          <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">No products yet</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">Add products so brands can discover and order from you</p>
          <Link href="/creator/products/new" className="inline-flex items-center gap-2 h-9 px-4 bg-indigo-600 text-white text-xs rounded-lg font-semibold hover:bg-indigo-700"><Plus className="w-3.5 h-3.5" /> Add First Product</Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-soft p-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3"><Package className="w-5 h-5 text-indigo-500" /></div>
              <h3 className="text-sm font-semibold text-gray-900">{p.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Price/Unit</p><p className="font-semibold">{formatCurrency(p.pricePerUnit)}</p></div>
                <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">MOQ</p><p className="font-semibold">{p.minOrderQty} units</p></div>
                <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Lead Time</p><p className="font-semibold">{p.leadTimeDays} days</p></div>
                <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Capacity</p><p className="font-semibold">{p.maxCapacity}/mo</p></div>
              </div>
              {p.customBranding && <span className="mt-2 inline-block text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">Custom Branding ✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
