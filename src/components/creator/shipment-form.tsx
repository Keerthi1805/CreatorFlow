'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export function ShipmentForm({ orderId }: { orderId: string }) {
  const [form, setForm] = useState({ courier:'', trackingNumber:'', expectedDelivery:'', weight:'', dimensions:'', notes:'' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    await fetch(`/api/orders/${orderId}/shipments`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
    setLoading(false); router.refresh()
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs text-gray-500 block mb-1">Courier *</label><input value={form.courier} onChange={e=>setForm(f=>({...f,courier:e.target.value}))} placeholder="Delhivery, DTDC…" required className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
        <div><label className="text-xs text-gray-500 block mb-1">Tracking Number *</label><input value={form.trackingNumber} onChange={e=>setForm(f=>({...f,trackingNumber:e.target.value}))} placeholder="DL123456789" required className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
        <div><label className="text-xs text-gray-500 block mb-1">Expected Delivery</label><input type="date" value={form.expectedDelivery} onChange={e=>setForm(f=>({...f,expectedDelivery:e.target.value}))} className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
        <div><label className="text-xs text-gray-500 block mb-1">Weight (kg)</label><input type="number" value={form.weight} onChange={e=>setForm(f=>({...f,weight:e.target.value}))} placeholder="12.5" className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></div>
      </div>
      <button type="submit" disabled={loading||!form.courier||!form.trackingNumber} className="h-10 px-6 bg-indigo-600 text-white text-sm rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">{loading?'Dispatching…':'Mark as Dispatched'}</button>
    </form>
  )
}
