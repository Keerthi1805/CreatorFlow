import { requireCreator } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, getOrderStatusColor, ORDER_STATUS_LABELS } from '@/utils'
import { notFound } from 'next/navigation'
import { OrderStatusUpdater } from '@/components/creator/order-status-updater'
import { ShipmentForm } from '@/components/creator/shipment-form'
import { SampleUploader } from '@/components/creator/sample-uploader'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export default async function CreatorOrderDetail({ params }: { params: { id: string } }) {
  const { profile } = await requireCreator()
  const order = await prisma.order.findFirst({ where: { id: params.id, creatorId: profile.id }, include: { brand: { include: { user: true } }, warehouse: true, items: true, samples: { orderBy: { requestedAt: 'desc' } }, shipments: { orderBy: { createdAt: 'desc' } }, payments: true, productionLogs: { orderBy: { createdAt: 'asc' } } } })
  if (!order) notFound()
  const latestSample = order.samples[0]
  const progress = order.status==='PRODUCTION_25'?25:order.status==='PRODUCTION_50'?50:order.status==='PRODUCTION_75'?75:['PRODUCTION_COMPLETE','QUALITY_CHECK','PACKAGING','READY_TO_SHIP','SHIPPED','DELIVERED','COMPLETED'].includes(order.status)?100:0
  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      <Link href="/creator/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <div className="flex items-start justify-between">
        <div><h1 className="text-xl font-bold text-gray-900">{order.orderNumber}</h1><p className="text-sm text-gray-500">{order.brand.companyName} · {order.items.length} item(s)</p></div>
        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${getOrderStatusColor(order.status)}`}>{ORDER_STATUS_LABELS[order.status]}</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4"><p className="text-xs text-gray-400">Order Value</p><p className="text-xl font-bold mt-1">{formatCurrency(order.totalAmount)}</p></div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4"><p className="text-xs text-gray-400">Advance Paid</p><p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(order.advancePaid)}</p></div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4"><p className="text-xs text-gray-400">Pending Payment</p><p className="text-xl font-bold text-amber-600 mt-1">{formatCurrency(order.finalAmount-order.finalPaid)}</p></div>
      </div>
      {progress>0 && <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4"><h2 className="text-sm font-semibold mb-3">Production Progress</h2><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full transition-all" style={{width:`${progress}%`}} /></div><p className="text-xs text-gray-500 mt-2">{progress}% complete</p></div>}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4">
          <h2 className="text-sm font-semibold mb-3">Order Details</h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-gray-400">Deadline</span><span>{order.deliveryDeadline?formatDate(order.deliveryDeadline):'—'}</span></div>
            {order.colorVariants?.length>0 && <div className="flex justify-between"><span className="text-gray-400">Colors</span><span>{order.colorVariants.join(', ')}</span></div>}
            {order.materialRequirements && <div><p className="text-gray-400">Materials</p><p className="mt-0.5">{order.materialRequirements}</p></div>}
            {order.packagingInstructions && <div><p className="text-gray-400">Packaging</p><p className="mt-0.5">{order.packagingInstructions}</p></div>}
          </div>
          {order.warehouse && <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs"><p className="font-semibold text-gray-700">Ship to: {order.warehouse.name}</p><p className="text-gray-500 mt-0.5">{order.warehouse.address}, {order.warehouse.city} {order.warehouse.pincode}</p><p className="text-gray-500">{order.warehouse.contactPerson} · {order.warehouse.phone}</p></div>}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4">
          <h2 className="text-sm font-semibold mb-3">Sample</h2>
          {!latestSample ? <p className="text-xs text-gray-400">No sample requested yet</p> : (
            <div className="space-y-2">
              <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${latestSample.status==='APPROVED'?'bg-green-100 text-green-700':latestSample.status==='UPLOADED'?'bg-blue-100 text-blue-700':latestSample.status==='REQUESTED'?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>{latestSample.status}</span>
              {latestSample.notes && <p className="text-xs text-gray-600">{latestSample.notes}</p>}
              {latestSample.brandNotes && <div className="p-2 bg-amber-50 rounded-lg"><p className="text-xs text-amber-700 font-medium">Brand Notes:</p><p className="text-xs text-amber-600">{latestSample.brandNotes}</p></div>}
            </div>
          )}
          {order.status==='SAMPLE_REQUESTED' && <SampleUploader orderId={order.id} />}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4">
        <h2 className="text-sm font-semibold mb-3">Update Production Status</h2>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>
      {order.status==='READY_TO_SHIP' && <div className="bg-white rounded-xl border border-indigo-100 shadow-soft p-4"><h2 className="text-sm font-semibold mb-3">Ship Order</h2><ShipmentForm orderId={order.id} /></div>}
      <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4">
        <h2 className="text-sm font-semibold mb-3">Production Timeline</h2>
        {order.productionLogs.length===0 ? <p className="text-xs text-gray-400">No updates yet</p> : (
          <div className="space-y-3">{order.productionLogs.map((log,i) => (
            <div key={log.id} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${i===order.productionLogs.length-1?'bg-indigo-500':'bg-gray-200'}`}><CheckCircle2 className={`w-3.5 h-3.5 ${i===order.productionLogs.length-1?'text-white':'text-gray-400'}`} /></div>
              <div><p className="text-xs font-medium">{ORDER_STATUS_LABELS[log.stage]}</p>{log.notes&&<p className="text-xs text-gray-500 mt-0.5">{log.notes}</p>}<p className="text-[10px] text-gray-400 mt-0.5">{formatDate(log.createdAt)}</p></div>
            </div>
          ))}</div>
        )}
      </div>
    </div>
  )
}
