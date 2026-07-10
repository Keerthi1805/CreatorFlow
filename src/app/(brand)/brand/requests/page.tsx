import { requireBrand } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/utils'
import { BrandRequestActions } from '@/components/brand/brand-request-actions'
export default async function BrandRequests() {
  const { profile } = await requireBrand()
  const requests = await prisma.collabRequest.findMany({ where:{brandId:profile.id}, include:{creator:{include:{user:true}}}, orderBy:{createdAt:'desc'} })
  const pending=requests.filter(r=>r.status==='PENDING'&&r.initiatedBy==='CREATOR')
  const sent=requests.filter(r=>r.initiatedBy==='BRAND')
  const resolved=requests.filter(r=>r.status!=='PENDING'&&r.initiatedBy==='CREATOR')
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-xl font-bold text-gray-900">Collaboration Requests</h1><p className="text-sm text-gray-500 mt-0.5">{pending.length} pending · {resolved.length} resolved</p></div>
      {pending.length>0&&(
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Incoming from Creators ({pending.length})</h2>
          {pending.map(req=>(
            <div key={req.id} className="bg-white rounded-xl border border-amber-100 shadow-soft p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">{req.creator.businessName[0]}</div>
                  <div><p className="text-sm font-semibold text-gray-900">{req.creator.businessName}</p><p className="text-xs text-gray-500">{req.creator.city}, {req.creator.state} · {req.creator.user.email}</p></div>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold flex-shrink-0">Pending Review</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                {req.expectedVolume&&<div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Capacity</p><p className="font-semibold mt-0.5">{req.expectedVolume.toLocaleString()} units</p></div>}
                {req.expectedRevenue&&<div className="bg-indigo-50 rounded-lg p-2"><p className="text-gray-400">Est. Value</p><p className="font-semibold text-indigo-700 mt-0.5">{formatCurrency(req.expectedRevenue)}</p></div>}
                {req.timeline&&<div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Lead Time</p><p className="font-semibold mt-0.5">{req.timeline}</p></div>}
              </div>
              {req.message&&<p className="mt-3 text-xs text-gray-600 bg-gray-50 rounded-lg p-3">{req.message}</p>}
              {req.requirements&&<p className="mt-2 text-xs text-gray-500">{req.requirements}</p>}
              <div className="mt-4"><BrandRequestActions collabId={req.id}/></div>
            </div>
          ))}
        </div>
      )}
      {sent.length>0&&(
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700">Sent by You ({sent.length})</h2>
          {sent.map(req=>(
            <div key={req.id} className="bg-white rounded-xl border border-gray-100 shadow-soft p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600">{req.creator.businessName[0]}</div>
              <div className="flex-1"><p className="text-sm font-medium text-gray-900">{req.creator.businessName}</p><p className="text-xs text-gray-400">{formatDate(req.createdAt)}</p></div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${req.status==='ACCEPTED'?'bg-green-100 text-green-700':req.status==='REJECTED'?'bg-red-100 text-red-700':'bg-amber-100 text-amber-700'}`}>{req.status==='PENDING'?'Awaiting Response':req.status}</span>
            </div>
          ))}
        </div>
      )}
      {resolved.length>0&&(
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700">History</h2>
          {resolved.map(req=>(
            <div key={req.id} className="bg-white rounded-xl border border-gray-100 shadow-soft p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-600">{req.creator.businessName[0]}</div>
              <div className="flex-1"><p className="text-sm font-medium">{req.creator.businessName}</p><p className="text-xs text-gray-400">{formatDate(req.createdAt)}</p></div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${req.status==='ACCEPTED'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{req.status}</span>
            </div>
          ))}
        </div>
      )}
      {requests.length===0&&<div className="bg-white rounded-xl border border-gray-100 shadow-soft p-12 text-center"><p className="text-gray-400 text-sm">No collaboration requests yet</p><p className="text-gray-300 text-xs mt-1">Creators can find your brand on the discover page and reach out</p></div>}
    </div>
  )
}
