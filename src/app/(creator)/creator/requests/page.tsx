import { requireCreator } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/utils'
import { RequestActions } from '@/components/creator/request-actions'

export default async function CreatorRequests() {
  const { profile } = await requireCreator()
  const requests = await prisma.collabRequest.findMany({
    where: { creatorId: profile.id },
    include: { brand: { include: { user: true } } },
    orderBy: { createdAt: 'desc' },
  })
  const pending = requests.filter(r => r.status === 'PENDING' && r.initiatedBy === 'BRAND')
  const sent = requests.filter(r => r.initiatedBy === 'CREATOR')
  const resolved = requests.filter(r => r.status !== 'PENDING' && r.initiatedBy === 'BRAND')

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-xl font-bold text-gray-900">Collaboration Requests</h1><p className="text-sm text-gray-500 mt-0.5">{pending.length} pending · {resolved.length} resolved</p></div>
      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Incoming — Pending ({pending.length})</h2>
          {pending.map(req => (
            <div key={req.id} className="bg-white rounded-xl border border-amber-100 shadow-soft p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-sm font-bold text-emerald-600 flex-shrink-0">{req.brand.companyName[0]}</div>
                  <div><p className="text-sm font-semibold text-gray-900">{req.brand.companyName}</p><p className="text-xs text-gray-500">{req.brand.user.email}</p></div>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold flex-shrink-0">Pending Review</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                {req.expectedVolume && <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Volume</p><p className="font-semibold text-gray-900 mt-0.5">{req.expectedVolume.toLocaleString()} units</p></div>}
                {req.expectedRevenue && <div className="bg-emerald-50 rounded-lg p-2"><p className="text-gray-400">Expected Revenue</p><p className="font-semibold text-emerald-700 mt-0.5">{formatCurrency(req.expectedRevenue)}</p></div>}
                {req.timeline && <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Timeline</p><p className="font-semibold text-gray-900 mt-0.5">{req.timeline}</p></div>}
              </div>
              {req.message && <p className="mt-3 text-xs text-gray-600 bg-gray-50 rounded-lg p-3">{req.message}</p>}
              <div className="mt-4"><RequestActions collabId={req.id} /></div>
            </div>
          ))}
        </div>
      )}
      {sent.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700">Sent by You ({sent.length})</h2>
          {sent.map(req => (
            <div key={req.id} className="bg-white rounded-xl border border-gray-100 shadow-soft p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-xs font-bold text-emerald-600">{req.brand.companyName[0]}</div>
              <div className="flex-1"><p className="text-sm font-medium text-gray-900">{req.brand.companyName}</p><p className="text-xs text-gray-400">{formatDate(req.createdAt)}</p></div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${req.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : req.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{req.status === 'PENDING' ? 'Awaiting Response' : req.status}</span>
            </div>
          ))}
        </div>
      )}
      {resolved.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700">History</h2>
          {resolved.map(req => (
            <div key={req.id} className="bg-white rounded-xl border border-gray-100 shadow-soft p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-600">{req.brand.companyName[0]}</div>
              <div className="flex-1"><p className="text-sm font-medium text-gray-900">{req.brand.companyName}</p><p className="text-xs text-gray-400">{formatDate(req.createdAt)}</p></div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${req.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{req.status}</span>
            </div>
          ))}
        </div>
      )}
      {requests.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-12 text-center"><p className="text-gray-400 text-sm">No collaboration requests yet</p></div>
      )}
    </div>
  )
}
