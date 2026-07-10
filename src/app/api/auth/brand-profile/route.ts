import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { clerkId }, include: { brandProfile: true } })
    return NextResponse.json({ data: user?.brandProfile ?? null })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) return NextResponse.json({ error: 'User not found. Please refresh and try again.' }, { status: 404 })
    await prisma.brandProfile.upsert({
      where: { userId: user.id },
      update: { ...body },
      create: { userId: user.id, ...body },
    })
    await prisma.user.update({ where: { id: user.id }, data: { onboarded: true, phone: body.phone } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('brand-profile POST error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const profile = await prisma.brandProfile.update({ where: { userId: user.id }, data: { ...body } })
    return NextResponse.json({ data: profile })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
