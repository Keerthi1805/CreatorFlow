import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDbUserId } from '@/lib/auth'

export async function GET() {
  try {
    const userId = await getDbUserId()
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { brandProfile: true } })
    if (!user?.brandProfile) return NextResponse.json({ data: [] })
    const warehouses = await prisma.warehouse.findMany({ where: { brandId: user.brandProfile.id } })
    return NextResponse.json({ data: warehouses })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getDbUserId()
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { brandProfile: true } })
    if (!user?.brandProfile) return NextResponse.json({ error: 'Brand only' }, { status: 403 })
    const body = await req.json()
    const warehouse = await prisma.warehouse.create({ data: { brandId: user.brandProfile.id, ...body } })
    return NextResponse.json({ data: warehouse }, { status: 201 })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
