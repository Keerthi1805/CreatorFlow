import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDbUserId } from '@/lib/auth'

export async function GET() {
  try {
    const userId = await getDbUserId()
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { creatorProfile: true } })
    if (!user?.creatorProfile) return NextResponse.json({ data: [] })
    const products = await prisma.product.findMany({ where: { creatorId: user.creatorProfile.id, isActive: true }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ data: products })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getDbUserId()
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { creatorProfile: true } })
    if (!user?.creatorProfile) return NextResponse.json({ error: 'Creator only' }, { status: 403 })
    const body = await req.json()
    const product = await prisma.product.create({
      data: { creatorId: user.creatorProfile.id, name: body.name, category: body.category, description: body.description, images: body.images ?? [], materials: body.materials ?? [], pricePerUnit: Number(body.pricePerUnit), minOrderQty: Number(body.minOrderQty), maxCapacity: Number(body.maxCapacity), leadTimeDays: Number(body.leadTimeDays), customBranding: body.customBranding ?? false, packagingOptions: body.packagingOptions ?? [], certifications: body.certifications ?? [] },
    })
    return NextResponse.json({ data: product }, { status: 201 })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
