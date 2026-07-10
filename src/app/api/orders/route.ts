import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDbUserId } from '@/lib/auth'
import { createNotification } from '@/lib/notifications'
import { generateOrderNumber } from '@/utils'

export async function GET(req: NextRequest) {
  try {
    const userId = await getDbUserId()
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { creatorProfile: true, brandProfile: true } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const where: any = {}
    if (user.role === 'CREATOR' && user.creatorProfile) where.creatorId = user.creatorProfile.id
    else if (user.role === 'BRAND' && user.brandProfile) where.brandId = user.brandProfile.id
    if (status) where.status = status
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        brand: { include: { user: { select: { name: true, email: true } } } },
        creator: { include: { user: { select: { name: true, email: true } } } },
        warehouse: true,
        samples: { orderBy: { requestedAt: 'desc' }, take: 1 },
        shipments: { orderBy: { createdAt: 'desc' }, take: 1 },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ data: orders })
  } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getDbUserId()
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { brandProfile: true } })
    if (!user?.brandProfile) return NextResponse.json({ error: 'Brand only' }, { status: 403 })
    const body = await req.json()
    const totalAmount = body.items.reduce((s: number, i: any) => s + i.quantity * i.unitPrice, 0)
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        brandId: user.brandProfile.id,
        creatorId: body.creatorId,
        warehouseId: body.warehouseId || undefined,
        totalAmount,
        advanceAmount: Number(body.advanceAmount) || 0,
        finalAmount: totalAmount - (Number(body.advanceAmount) || 0),
        commissionAmount: totalAmount * 0.05,
        colorVariants: body.colorVariants || [],
        materialRequirements: body.materialRequirements,
        packagingInstructions: body.packagingInstructions,
        privateLabelRequired: body.privateLabelRequired || false,
        brandLogoRequired: body.brandLogoRequired || false,
        shippingInstructions: body.shippingInstructions,
        deliveryDeadline: body.deliveryDeadline ? new Date(body.deliveryDeadline) : undefined,
        notes: body.notes,
        items: { create: body.items.map((i: any) => ({ productId: i.productId, productName: i.productName, quantity: Number(i.quantity), unitPrice: Number(i.unitPrice), totalPrice: Number(i.quantity) * Number(i.unitPrice) })) },
      },
      include: { creator: { include: { user: true } }, items: true },
    })
    await createNotification({ userId: order.creator.userId, type: 'ORDER_CREATED', title: 'New Order Received', message: `${user.brandProfile.companyName} placed order ${order.orderNumber} worth ₹${totalAmount.toLocaleString('en-IN')}`, link: `/creator/orders/${order.id}` })
    return NextResponse.json({ data: order }, { status: 201 })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
