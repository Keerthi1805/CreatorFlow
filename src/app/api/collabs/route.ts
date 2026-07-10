import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDbUserId } from '@/lib/auth'
import { createNotification } from '@/lib/notifications'

export async function GET() {
  try {
    const userId = await getDbUserId()
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { brandProfile: true, creatorProfile: true } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const where = user.role === 'BRAND' ? { brandId: user.brandProfile!.id } : { creatorId: user.creatorProfile!.id }
    const collabs = await prisma.collabRequest.findMany({
      where,
      include: {
        brand: { include: { user: { select: { name: true, avatarUrl: true } } } },
        creator: { include: { user: { select: { name: true, avatarUrl: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ data: collabs })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getDbUserId()
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { brandProfile: true, creatorProfile: true } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const body = await req.json()

    if (user.role === 'BRAND' && user.brandProfile) {
      const creator = await prisma.creatorProfile.findUnique({ where: { id: body.creatorId }, include: { user: true } })
      if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
      const collab = await prisma.collabRequest.create({
        data: { brandId: user.brandProfile.id, creatorId: body.creatorId, initiatedBy: 'BRAND', message: body.message, requirements: body.requirements, expectedVolume: body.expectedVolume ? Number(body.expectedVolume) : undefined, expectedRevenue: body.expectedRevenue ? Number(body.expectedRevenue) : undefined, timeline: body.timeline, brandingInstructions: body.brandingInstructions },
      })
      await createNotification({ userId: creator.userId, type: 'COLLAB_REQUEST', title: 'New Collaboration Request', message: `${user.brandProfile.companyName} wants to collaborate with you!`, link: '/creator/requests' })
      return NextResponse.json({ data: collab }, { status: 201 })
    }

    if (user.role === 'CREATOR' && user.creatorProfile) {
      const brand = await prisma.brandProfile.findUnique({ where: { id: body.brandId }, include: { user: true } })
      if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
      const collab = await prisma.collabRequest.create({
        data: { brandId: body.brandId, creatorId: user.creatorProfile.id, initiatedBy: 'CREATOR', message: body.message, requirements: body.requirements, expectedVolume: body.expectedVolume ? Number(body.expectedVolume) : undefined, expectedRevenue: body.expectedRevenue ? Number(body.expectedRevenue) : undefined, timeline: body.timeline },
      })
      await createNotification({ userId: brand.userId, type: 'COLLAB_REQUEST', title: 'New Collaboration Interest', message: `${user.creatorProfile.businessName} is interested in working with your brand!`, link: '/brand/requests' })
      return NextResponse.json({ data: collab }, { status: 201 })
    }

    return NextResponse.json({ error: 'Profile not set up' }, { status: 403 })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
