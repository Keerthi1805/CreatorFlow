import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDbUserId } from '@/lib/auth'

export async function GET() {
  try {
    const userId = await getDbUserId()
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { creatorProfile: true } })
    if (!user?.creatorProfile) return NextResponse.json({ error: 'Creator only' }, { status: 403 })
    const cId = user.creatorProfile.id
    const [orders, pendingRequests, notifications] = await Promise.all([
      prisma.order.findMany({ where: { creatorId: cId }, include: { brand: true, payments: true } }),
      prisma.collabRequest.count({ where: { creatorId: cId, status: 'PENDING', initiatedBy: 'BRAND' } }),
      prisma.notification.findMany({ where: { userId, isRead: false }, orderBy: { createdAt: 'desc' }, take: 10 }),
    ])
    const stats = {
      activeOrders: orders.filter(o => !['COMPLETED','CANCELLED','DELIVERED'].includes(o.status)).length,
      pendingRequests,
      inProduction: orders.filter(o => ['IN_PRODUCTION','PRODUCTION_25','PRODUCTION_50','PRODUCTION_75','PRODUCTION_COMPLETE'].includes(o.status)).length,
      readyToShip: orders.filter(o => o.status === 'READY_TO_SHIP').length,
      completed: orders.filter(o => o.status === 'COMPLETED').length,
      totalRevenue: user.creatorProfile.totalRevenue,
      pendingPayments: orders.reduce((s, o) => s + (o.finalAmount - o.finalPaid), 0),
      rating: user.creatorProfile.rating,
      unreadNotifications: notifications.length,
    }
    return NextResponse.json({ data: { stats, recentOrders: orders.slice(0, 5), notifications } })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
