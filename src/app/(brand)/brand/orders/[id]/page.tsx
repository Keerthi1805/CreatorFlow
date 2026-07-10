import { requireBrand } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, getOrderStatusColor, ORDER_STATUS_LABELS } from '@/utils'
import { notFound } from 'next/navigation'
import { SampleReviewer } from '@/components/brand/sample-reviewer'
import { PaymentForm } from '@/components/brand/payment-form'
import { SampleRequester } from '@/components/brand/sample-requester'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
export default async function BrandOrderDetail({ params }: { params: { id: string } }) {
  const { profile } = await requireBrand()
  const order = await prisma.order.findFirst({ where:{id:params.id,brandId:profile.id}, include:{creator:{include:{user:true}},warehouse:true,items:true,samples:{orderBy:{requestedAt:'desc'}},shipments:{orderBy:{createdAt:'desc'}},payments:{orderBy:{createdAt:'desc'}},productionLogs:{orderBy:{createdAt:'asc'}}} })
  if(!order) notFound()
  const latestSample=order.samples[0]; const latestShipment=order.shipments[0]
  const progress=order.status==='PRODUCTION_25'?25:order.status==='PRODUCTION_50'?50:order.status==='PRODUCTION_75'?75:['PRODUCTION_COMPLETE','QUALITY_CHECK','PACKAGING','READY_TO_SHIP','SHIPPED','DELIVERED','COMPLETED'].includes(order.status)?100:0
  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      <Link href="/brand/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"><ArrowLeft className="w-4 h-4"/>Back</Link>
      <div className="flex items-start justify-between">
        <div><h1 className="text-xl font-bold text-gray-900">{order.orderNumber}</h1><p className="text-sm text-gray-500">{order.creator.businessName} · {order.items.length} item(s)</p></div>
        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${getOrderStatusColor(order.status)}`}>{ORDER_STATUS_LABELS[order.status]}</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4"><p className="text-xs text-gray-400">Total Value</p><p className="text-lg font-bold mt-1">{formatCurrency(order.totalAmount)}</p></div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4"><p className="text-xs text-gray-400">Advance Paid</p><p className="text-lg font-bold text-emerald-600 mt-1">{formatCurrency(order.advancePaid)}</p></div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4"><p className="text-xs text-gray-400">Balance Due</p><p className="text-lg font-bold text-amber-600 mt-1">{formatCurrency(order.finalAmount-order.finalPaid)}</p></div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4"><p className="text-xs text-gray-400">Deadline</p><p className="text-lg font-bold mt-1">{order.deliveryDeadline?formatDate(order.deliveryDeadline):'—'}</p></div>
      </div>
      {progress>0&&<div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4"><h2 className="text-sm font-semibold mb-3">Production Progress</h2><div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all" style={{width:`${progress}%`}}/></div><p className="text-xs text-gray-500 mt-2">{progress}% complete</p></div>}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4">
          <h2 className="text-sm font-semibold mb-3">Creator</h2>
          <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg font-bold text-indigo-600">{order.creator.businessName[0]}</div><div><p className="text-sm font-semibold">{order.creator.businessName}</p><p className="text-xs text-gray-500">{order.creator.city}, {order.creator.state}</p></div></div>
          <div className="space-y-1.5 text-xs">
            {order.colorVariants?.length>0&&<div className="flex justify-between"><span className="text-gray-400">Colors</span><span>{order.colorVariants.join(', ')}</span></div>}
            {order.materialRequirements&&<div><p className="text-gray-400">Materials</p><p className="mt-0.5">{order.materialRequirements}</p></div>}
            {order.packagingInstructions&&<div><p className="text-gray-400">Packaging</p><p className="mt-0.5">{order.packagingInstructions}</p></div>}
            {order.privateLabelRequired&&<div className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5"/>Private Label Required</div>}
          </div>
          {order.warehouse&&<div className="mt-3 p-2 bg-gray-50 rounded-lg text-xs text-gray-500">📦 {order.warehouse.name}, {order.warehouse.city}</div>}
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4">
            <h2 className="text-sm font-semibold mb-3">Sample</h2>
            {!latestSample&&order.status==='CONFIRMED'&&<SampleRequester orderId={order.id}/>}
            {!latestSample&&order.status!=='CONFIRMED'&&<p className="text-xs text-gray-400">No sample requested</p>}
            {latestSample&&<div className="space-y-2">
              <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${latestSample.status==='APPROVED'?'bg-green-100 text-green-700':latestSample.status==='UPLOADED'?'bg-blue-100 text-blue-700':latestSample.status==='REQUESTED'?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>{latestSample.status}</span>
              {latestSample.notes&&<p className="text-xs text-gray-600">{latestSample.notes}</p>}
              {latestSample.status==='UPLOADED'&&<SampleReviewer orderId={order.id}/>}
              {latestSample.status==='APPROVED'&&<p className="text-xs text-emerald-600 font-medium">✓ Approved — production can begin</p>}
            </div>}
          </div>
          {latestShipment&&<div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4">
            <h2 className="text-sm font-semibold mb-3">Shipment</h2>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-gray-400">Courier</span><span className="font-medium">{latestShipment.courier}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Tracking</span><span className="font-mono">{latestShipment.trackingNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Dispatched</span><span>{latestShipment.dispatchDate?formatDate(latestShipment.dispatchDate):'—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Expected</span><span>{latestShipment.expectedDelivery?formatDate(latestShipment.expectedDelivery):'—'}</span></div>
            </div>
          </div>}
        </div>
      </div>
      {order.status!=='CANCELLED'&&(order.finalAmount-order.finalPaid)>0&&<div className="bg-white rounded-xl border border-emerald-100 shadow-soft p-4"><h2 className="text-sm font-semibold mb-3">Release Payment</h2><PaymentForm orderId={order.id} remaining={order.finalAmount-order.finalPaid} advancePaid={order.advancePaid}/></div>}
      <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-4">
        <h2 className="text-sm font-semibold mb-3">Production Timeline</h2>
        {order.productionLogs.length===0?<p className="text-xs text-gray-400">No updates yet</p>
          :<div className="space-y-3">{order.productionLogs.map((log,i)=>(
          <div key={log.id} className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${i===order.productionLogs.length-1?'bg-emerald-500':'bg-gray-200'}`}><CheckCircle2 className={`w-3.5 h-3.5 ${i===order.productionLogs.length-1?'text-white':'text-gray-400'}`}/></div>
            <div><p className="text-xs font-medium">{ORDER_STATUS_LABELS[log.stage]}</p>{log.notes&&<p className="text-xs text-gray-500 mt-0.5">{log.notes}</p>}<p className="text-[10px] text-gray-400 mt-0.5">{formatDate(log.createdAt)}</p></div>
          </div>
        ))}</div>}
      </div>
    </div>
  )
}
