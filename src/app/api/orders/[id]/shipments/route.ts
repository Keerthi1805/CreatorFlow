import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDbUserId } from '@/lib/auth'
import { createNotification } from '@/lib/notifications'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getDbUserId()
    const body = await req.json()
    const order = await prisma.order.findUnique({ where: { id: params.id }, include: { brand: { include: { user: true } }, creator: { include: { user: true } } } })
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const shipment = await prisma.shipment.create({
      data: { orderId: params.id, status: 'DISPATCHED', courier: body.courier, trackingNumber: body.trackingNumber, dispatchDate: new Date(), expectedDelivery: body.expectedDelivery ? new Date(body.expectedDelivery) : undefined, weight: body.weight ? Number(body.weight) : undefined, dimensions: body.dimensions, notes: body.notes },
    })
    await prisma.order.update({ where: { id: params.id }, data: { status: 'SHIPPED', shippedAt: new Date() } })
    await createNotification({ userId: order.brand.userId, type: 'SHIPMENT_DISPATCHED', title: 'Order Shipped!', message: `Order ${order.orderNumber} dispatched via ${body.courier}. Tracking: ${body.trackingNumber}`, link: `/brand/orders/${params.id}` })
    return NextResponse.json({ data: shipment }, { status: 201 })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
