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
    const payment = await prisma.payment.create({
      data: { orderId: params.id, amount: Number(body.amount), type: body.type, status: 'PAID', method: body.method, transactionId: body.transactionId, paidAt: new Date(), notes: body.notes },
    })
    const isAdv = body.type === 'ADVANCE'
    await prisma.order.update({ where: { id: params.id }, data: isAdv ? { advancePaid: { increment: Number(body.amount) }, paymentStatus: 'ADVANCE_PAID' } : { finalPaid: { increment: Number(body.amount) }, paymentStatus: 'PAID' } })
    await prisma.creatorProfile.update({ where: { id: order.creatorId }, data: { totalRevenue: { increment: Number(body.amount) } } })
    await createNotification({ userId: order.creator.userId, type: 'PAYMENT_RELEASED', title: 'Payment Received!', message: `₹${Number(body.amount).toLocaleString('en-IN')} ${body.type} payment for Order ${order.orderNumber}`, link: '/creator/earnings' })
    return NextResponse.json({ data: payment }, { status: 201 })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
