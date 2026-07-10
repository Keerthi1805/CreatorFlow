import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDbUserId } from '@/lib/auth'
import { createNotification } from '@/lib/notifications'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getDbUserId()
    const { action, notes } = await req.json()
    const order = await prisma.order.findUnique({ where: { id: params.id }, include: { brand: { include: { user: true } }, creator: { include: { user: true } } } })
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (action === 'REQUEST') {
      await prisma.sample.create({ data: { orderId: params.id, status: 'REQUESTED', notes } })
      await prisma.order.update({ where: { id: params.id }, data: { status: 'SAMPLE_REQUESTED' } })
      await createNotification({ userId: order.creator.userId, type: 'SAMPLE_REQUESTED', title: 'Sample Requested', message: `${order.brand.companyName} has requested a sample for Order ${order.orderNumber}`, link: `/creator/orders/${params.id}` })
    }
    if (action === 'UPLOAD') {
      const sample = await prisma.sample.findFirst({ where: { orderId: params.id }, orderBy: { requestedAt: 'desc' } })
      if (sample) await prisma.sample.update({ where: { id: sample.id }, data: { status: 'UPLOADED', notes, uploadedAt: new Date() } })
      await prisma.order.update({ where: { id: params.id }, data: { status: 'SAMPLE_UPLOADED' } })
      await createNotification({ userId: order.brand.userId, type: 'SAMPLE_UPLOADED', title: 'Sample Ready for Review', message: `${order.creator.businessName} uploaded a sample for Order ${order.orderNumber}`, link: `/brand/orders/${params.id}` })
    }
    if (action === 'APPROVE') {
      const sample = await prisma.sample.findFirst({ where: { orderId: params.id }, orderBy: { requestedAt: 'desc' } })
      if (sample) await prisma.sample.update({ where: { id: sample.id }, data: { status: 'APPROVED', brandNotes: notes, reviewedAt: new Date() } })
      await prisma.order.update({ where: { id: params.id }, data: { status: 'SAMPLE_APPROVED' } })
      await createNotification({ userId: order.creator.userId, type: 'SAMPLE_APPROVED', title: 'Sample Approved!', message: `${order.brand.companyName} approved your sample. Proceed to production.`, link: `/creator/orders/${params.id}` })
    }
    if (action === 'REJECT') {
      const sample = await prisma.sample.findFirst({ where: { orderId: params.id }, orderBy: { requestedAt: 'desc' } })
      if (sample) await prisma.sample.update({ where: { id: sample.id }, data: { status: 'REJECTED', brandNotes: notes, reviewedAt: new Date() } })
      await prisma.order.update({ where: { id: params.id }, data: { status: 'SAMPLE_REJECTED' } })
      await createNotification({ userId: order.creator.userId, type: 'SAMPLE_REJECTED', title: 'Sample Needs Revision', message: `${order.brand.companyName} requested modifications. Notes: ${notes}`, link: `/creator/orders/${params.id}` })
    }
    return NextResponse.json({ success: true })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
