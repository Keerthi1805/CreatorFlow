import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDbUserId } from '@/lib/auth'

export async function GET() {
  try {
    const userId = await getDbUserId()
    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ])
    return NextResponse.json({ data: notifications, unreadCount })
  } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getDbUserId()
    const { ids, markAll } = await req.json()
    if (markAll) await prisma.notification.updateMany({ where: { userId }, data: { isRead: true } })
    else if (ids?.length) await prisma.notification.updateMany({ where: { id: { in: ids }, userId }, data: { isRead: true } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
