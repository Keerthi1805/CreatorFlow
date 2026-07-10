import { requireCreator } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/utils'
import { Truck } from 'lucide-react'
export default async function CreatorShipments() {
  const { profile } = await requireCreator()
  const orders = await prisma.order.findMany({ where:{creatorId:profile.id,status:{in:['SHIPPED','DELIVERED','COMPLETED','READY_TO_SHIP']}}, include:{brand:true,warehouse:true,shipments:{orderBy:{createdAt:'desc'}}}, orderBy:{updatedAt:'desc'} })
  return (
    <div className="space-y-5 animate-fade-in">
      <div><h1 className="text-xl font-bold text-gray-900">Shipments</h1><p className="text-sm text-gray-500">{orders.length} orders</p></div>
      {orders.length===0?<div className="bg-white rounded-xl border border-gray-100 shadow-soft p-12 text-center"><Truck className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-400">No shipments yet</p></div>
        :orders.map(order=>{const ship=order.shipments[0];return(
        <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-soft p-4">
          <div className="flex items-start justify-between"><div><p className="text-sm font-semibold">{order.orderNumber}</p><p className="text-xs text-gray-500">{order.brand.companyName}</p></div>
          <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${order.status==='DELIVERED'||order.status==='COMPLETED'?'bg-green-100 text-green-700':order.status==='SHIPPED'?'bg-blue-100 text-blue-700':'bg-amber-100 text-amber-700'}`}>{order.status.replace(/_/g,' ')}</span></div>
          {ship?<div className="mt-3 grid grid-cols-3 gap-3 text-xs"><div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Courier</p><p className="font-semibold mt-0.5">{ship.courier}</p></div><div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Tracking</p><p className="font-semibold font-mono mt-0.5">{ship.trackingNumber}</p></div><div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Dispatched</p><p className="font-semibold mt-0.5">{ship.dispatchDate?formatDate(ship.dispatchDate):'—'}</p></div></div>:<p className="text-xs text-gray-400 mt-2">No shipment details yet</p>}
          {order.warehouse&&<p className="text-xs text-gray-500 mt-2">📦 {order.warehouse.name}, {order.warehouse.city}</p>}
        </div>
      )})}
    </div>
  )
}
