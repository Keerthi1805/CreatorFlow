'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
const CATS = ['Bangles','Jewelry','Sarees','Clothing','Handicrafts','Pottery','Leather','Accessories','Crochet','Home Decor','Candles','Other']
export default function NewProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Bangles')
  const [description, setDescription] = useState('')
  const [pricePerUnit, setPricePerUnit] = useState('')
  const [minOrderQty, setMinOrderQty] = useState('')
  const [maxCapacity, setMaxCapacity] = useState('')
  const [leadTimeDays, setLeadTimeDays] = useState('')
  const [customBranding, setCustomBranding] = useState(false)
  const [materials, setMaterials] = useState('')
  const ic = "w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/products', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ name, category, description, pricePerUnit: Number(pricePerUnit), minOrderQty: Number(minOrderQty), maxCapacity: Number(maxCapacity), leadTimeDays: Number(leadTimeDays), customBranding, materials: materials.split(',').map(s=>s.trim()).filter(Boolean) }) })
    if (res.ok) router.push('/creator/products')
    setLoading(false)
  }
  return (
    <div className="max-w-2xl animate-fade-in">
      <Link href="/creator/products" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-5"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <h1 className="text-xl font-bold text-gray-900 mb-5">Add New Product</h1>
      <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 shadow-soft p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label><input required autoComplete="off" placeholder="Rajasthani Lac Bangles" value={name} onChange={e=>setName(e.target.value)} className={ic} /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Category *</label><select value={category} onChange={e=>setCategory(e.target.value)} className={ic}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
        </div>
        <div><label className="block text-xs font-medium text-gray-600 mb-1">Description *</label><textarea rows={3} required value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe your product…" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Price Per Unit (₹) *</label><input type="number" required autoComplete="off" placeholder="120" value={pricePerUnit} onChange={e=>setPricePerUnit(e.target.value)} className={ic} /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Min Order Qty *</label><input type="number" required autoComplete="off" placeholder="50" value={minOrderQty} onChange={e=>setMinOrderQty(e.target.value)} className={ic} /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Monthly Max Capacity *</label><input type="number" required autoComplete="off" placeholder="500" value={maxCapacity} onChange={e=>setMaxCapacity(e.target.value)} className={ic} /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Lead Time (days) *</label><input type="number" required autoComplete="off" placeholder="7" value={leadTimeDays} onChange={e=>setLeadTimeDays(e.target.value)} className={ic} /></div>
        </div>
        <div><label className="block text-xs font-medium text-gray-600 mb-1">Materials (comma separated)</label><input autoComplete="off" placeholder="Lac, Mirror, Thread" value={materials} onChange={e=>setMaterials(e.target.value)} className={ic} /></div>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={customBranding} onChange={e=>setCustomBranding(e.target.checked)} className="w-4 h-4 accent-indigo-600" /><span className="text-sm text-gray-700">Custom branding available</span></label>
        <button type="submit" disabled={loading||!name||!description||!pricePerUnit} className="w-full h-11 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50">{loading?'Adding…':'Add Product'}</button>
      </form>
    </div>
  )
}
