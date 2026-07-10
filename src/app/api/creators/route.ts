import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const creators = await prisma.creatorProfile.findMany({
      where: {
        ...(category && category !== 'All' && { categories: { has: category } }),
        ...(search && { OR: [{ businessName: { contains: search, mode: 'insensitive' } }, { city: { contains: search, mode: 'insensitive' } }] }),
        isActive: true,
      },
      include: {
        user: { select: { name: true, verificationStatus: true } },
        products: { where: { isActive: true }, take: 3 },
      },
      orderBy: { rating: 'desc' },
    })
    return NextResponse.json({ data: creators })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
