import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: true,
        brand: { include: { user: { select: { name: true, email: true, avatarUrl: true } } } },
        creator: { include: { user: { select: { name: true, email: true, avatarUrl: true } } } },
        warehouse: true,
        samples: { orderBy: { requestedAt: 'desc' } },
        shipments: { orderBy: { createdAt: 'desc' } },
        payments: { orderBy: { createdAt: 'desc' } },
        productionLogs: { orderBy: { createdAt: 'asc' } },
        activityLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    })
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: order })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
