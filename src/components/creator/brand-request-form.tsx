'use client'
import { useState } from 'react'
import { HandshakeIcon, X } from 'lucide-react'
export function BrandRequestForm({ brandId, brandName }: { brandId: string; brandName: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [message, setMessage] = useState(''); const [requirements, setRequirements] = useState(''); const [expectedVolume, setExpectedVolume] = useState(''); const [expectedRevenue, setExpectedRevenue] = useState(''); const [timeline, setTimeline] = useState('')
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    await fetch('/api/collabs', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ brandId, message, requirements, expectedVolume:expectedVolume?Number(expectedVolume):undefined, expectedRevenue:expectedRevenue?Number(expectedRevenue):undefined, timeline }) })
    setLoading(false); setDone(true); setOpen(false)
  }
  if (done) return <div className="h-9 flex items-center justify-center text-xs text-indigo-600 font-semibold bg-indigo-50 rounded-lg">Request Sent ✓</div>
  return (
    <>
      <button onClick={()=>setOpen(true)} className="w-full h-9 bg-indigo-600 text-white text-xs rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-1.5"><HandshakeIcon className="w-3.5 h-3.5"/>Express Interest</button>
      {open&&<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold">Connect with {brandName}</h3><button onClick={()=>setOpen(false)}><X className="w-4 h-4 text-gray-400"/></button></div>
          <form onSubmit={submit} className="space-y-3">
            <div><label className="text-xs text-gray-500 block mb-1">Message *</label><textarea rows={2} required value={message} onChange={e=>setMessage(e.target.value)} placeholder="Introduce yourself and what you can offer…" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"/></div>
            <div><label className="text-xs text-gray-500 block mb-1">What you can produce</label><textarea rows={2} value={requirements} onChange={e=>setRequirements(e.target.value)} placeholder="Products, materials, customization options…" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"/></div>
            <div className="grid grid-cols-3 gap-2">
              <div><label className="text-xs text-gray-500 block mb-1">Capacity</label><input type="number" value={expectedVolume} onChange={e=>setExpectedVolume(e.target.value)} placeholder="500" className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"/></div>
              <div><label className="text-xs text-gray-500 block mb-1">Est. Value (₹)</label><input type="number" value={expectedRevenue} onChange={e=>setExpectedRevenue(e.target.value)} placeholder="60000" className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"/></div>
              <div><label className="text-xs text-gray-500 block mb-1">Lead Time</label><input value={timeline} onChange={e=>setTimeline(e.target.value)} placeholder="2 weeks" className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"/></div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={()=>setOpen(false)} className="flex-1 h-9 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading||!message} className="flex-1 h-9 bg-indigo-600 text-white text-sm rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">{loading?'Sending…':'Send Request'}</button>
            </div>
          </form>
        </div>
      </div>}
    </>
  )
}
