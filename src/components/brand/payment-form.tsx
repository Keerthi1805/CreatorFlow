'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IndianRupee } from 'lucide-react'
export function PaymentForm({ orderId, remaining, advancePaid }: { orderId: string; remaining: number; advancePaid: number }) {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState(advancePaid===0?'ADVANCE':'FINAL')
  const [method, setMethod] = useState('NEFT')
  const [transactionId, setTransactionId] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    await fetch(`/api/orders/${orderId}/payments`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({amount,type,method,transactionId}) })
    setLoading(false); setDone(true); router.refresh()
  }
  if(done) return <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold"><IndianRupee className="w-4 h-4"/>Payment recorded successfully!</div>
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs text-gray-500 block mb-1">Payment Type</label><select value={type} onChange={e=>setType(e.target.value)} className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"><option value="ADVANCE">Advance</option><option value="FINAL">Final Payment</option><option value="PARTIAL">Partial</option></select></div>
        <div><label className="text-xs text-gray-500 block mb-1">Amount (₹) — Balance: ₹{remaining.toLocaleString('en-IN')}</label><input type="number" required placeholder={String(remaining)} value={amount} onChange={e=>setAmount(e.target.value)} className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"/></div>
        <div><label className="text-xs text-gray-500 block mb-1">Payment Method</label><select value={method} onChange={e=>setMethod(e.target.value)} className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">{['NEFT','RTGS','IMPS','UPI','Cheque','Cash'].map(m=><option key={m}>{m}</option>)}</select></div>
        <div><label className="text-xs text-gray-500 block mb-1">Transaction ID</label><input placeholder="UTR / Ref" value={transactionId} onChange={e=>setTransactionId(e.target.value)} className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"/></div>
      </div>
      <button type="submit" disabled={loading||!amount} className="h-10 px-6 bg-emerald-600 text-white text-sm rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"><IndianRupee className="w-4 h-4"/>{loading?'Recording…':'Record Payment & Notify Creator'}</button>
    </form>
  )
}
