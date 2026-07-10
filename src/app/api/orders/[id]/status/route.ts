import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDbUserId } from '@/lib/auth'
import { createNotification } from '@/lib/notifications'

const LABELS: Record<string, string> = {
  CONFIRMED:'Order Confirmed', IN_PRODUCTION:'Production Started', PRODUCTION_25:'25% Complete',
  PRODUCTION_50:'50% Complete', PRODUCTION_75:'75% Complete', PRODUCTION_COMPLETE:'Production Complete',
  QUALITY_CHECK:'Quality Check', PACKAGING:'Packaging', READY_TO_SHIP:'Ready to Ship',
  SHIPPED:'Shipped', DELIVERED:'Delivered', COMPLETED:'Completed', CANCELLED:'Cancelled',
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getDbUserId()
    const { status, notes } = await req.json()
    const order = await prisma.order.findUnique({ where: { id: params.id }, include: { brand: { include: { user: true } }, creator: { include: { user: true } } } })
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const pct = status === 'PRODUCTION_25' ? 25 : status === 'PRODUCTION_50' ? 50 : status === 'PRODUCTION_75' ? 75 : status === 'PRODUCTION_COMPLETE' ? 100 : 0
    const updated = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        ...(status === 'CONFIRMED' && { confirmedAt: new Date() }),
        ...(status === 'IN_PRODUCTION' && { productionStartedAt: new Date() }),
        ...(status === 'SHIPPED' && { shippedAt: new Date() }),
        ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
        productionLogs: { create: { stage: status, percentage: pct, notes: notes ?? '' } },
      },
    })
    const label = LABELS[status] ?? status
    await createNotification({ userId: order.brand.userId, type: 'PRODUCTION_UPDATE', title: `Order Update: ${label}`, message: `Order ${order.orderNumber} — ${label}${notes ? ': ' + notes : ''}`, link: `/brand/orders/${order.id}` })
    return NextResponse.json({ data: updated })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
