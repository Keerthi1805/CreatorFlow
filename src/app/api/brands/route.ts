import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const brands = await prisma.brandProfile.findMany({
      where: {
        ...(category && category !== 'All' && { categories: { has: category } }),
        ...(search && { OR: [{ companyName: { contains: search, mode: 'insensitive' } }, { contactPerson: { contains: search, mode: 'insensitive' } }] }),
        isActive: true,
      },
      include: {
        user: { select: { verificationStatus: true } },
        warehouses: { select: { city: true, state: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ data: brands })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
