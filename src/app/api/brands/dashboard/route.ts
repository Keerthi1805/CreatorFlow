import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDbUserId } from '@/lib/auth'

export async function GET() {
  try {
    const userId = await getDbUserId()
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { brandProfile: true } })
    if (!user?.brandProfile) return NextResponse.json({ error: 'Brand only' }, { status: 403 })
    const bId = user.brandProfile.id
    const [orders, pendingCollabs, notifications] = await Promise.all([
      prisma.order.findMany({ where: { brandId: bId }, include: { creator: true, shipments: { take: 1 } } }),
      prisma.collabRequest.count({ where: { brandId: bId, status: 'PENDING' } }),
      prisma.notification.findMany({ where: { userId, isRead: false }, orderBy: { createdAt: 'desc' }, take: 10 }),
    ])
    const stats = {
      totalOrders: orders.length,
      pendingCollabs,
      inProduction: orders.filter(o => ['IN_PRODUCTION','PRODUCTION_25','PRODUCTION_50','PRODUCTION_75','PRODUCTION_COMPLETE','QUALITY_CHECK','PACKAGING'].includes(o.status)).length,
      inTransit: orders.filter(o => o.status === 'SHIPPED').length,
      completed: orders.filter(o => o.status === 'COMPLETED').length,
      samplePending: orders.filter(o => ['SAMPLE_REQUESTED','SAMPLE_UPLOADED'].includes(o.status)).length,
      totalSpend: user.brandProfile.totalSpend,
      pendingPayments: orders.reduce((s, o) => s + (o.finalAmount - o.finalPaid), 0),
      activeCreators: user.brandProfile.activeCreators,
      unreadNotifications: notifications.length,
    }
    return NextResponse.json({ data: { stats, recentOrders: orders.slice(0, 5), notifications } })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
