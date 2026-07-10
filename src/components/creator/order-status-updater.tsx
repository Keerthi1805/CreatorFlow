'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
const NEXT: Record<string,{value:string;label:string}[]> = {
  SAMPLE_APPROVED:[{value:'IN_PRODUCTION',label:'Start Production'}],
  CONFIRMED:[{value:'IN_PRODUCTION',label:'Start Production'}],
  IN_PRODUCTION:[{value:'PRODUCTION_25',label:'Mark 25% Complete'}],
  PRODUCTION_25:[{value:'PRODUCTION_50',label:'Mark 50% Complete'}],
  PRODUCTION_50:[{value:'PRODUCTION_75',label:'Mark 75% Complete'}],
  PRODUCTION_75:[{value:'PRODUCTION_COMPLETE',label:'Production Complete'}],
  PRODUCTION_COMPLETE:[{value:'QUALITY_CHECK',label:'Start Quality Check'}],
  QUALITY_CHECK:[{value:'PACKAGING',label:'Move to Packaging'}],
  PACKAGING:[{value:'READY_TO_SHIP',label:'Mark Ready to Ship'}],
}
export function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const stages = NEXT[currentStatus] ?? []
  if (stages.length===0) return <p className="text-xs text-gray-400">No further updates needed at this stage</p>
  async function update(stage: string) {
    setLoading(true)
    await fetch(`/api/orders/${orderId}/status`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status:stage,notes}) })
    setLoading(false)
    router.refresh()
  }
  return (
    <div className="space-y-3">
      <textarea rows={2} placeholder="Add notes (optional)..." value={notes} onChange={e=>setNotes(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      <div className="flex gap-2">{stages.map(s=>(
        <button key={s.value} onClick={()=>update(s.value)} disabled={loading} className="h-9 px-4 bg-indigo-600 text-white text-xs rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">{loading?'Updating…':s.label}</button>
      ))}</div>
    </div>
  )
}
