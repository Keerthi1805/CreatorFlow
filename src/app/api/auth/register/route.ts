import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const cu = await currentUser()
    if (!cu) return NextResponse.json({ error: 'No clerk user' }, { status: 401 })
    const { role } = await req.json()
    const email = cu.emailAddresses[0]?.emailAddress ?? ''
    const name = `${cu.firstName ?? ''} ${cu.lastName ?? ''}`.trim() || email
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: { role },
      create: { clerkId, email, name, role, avatarUrl: cu.imageUrl },
    })
    return NextResponse.json({ data: user })
  } catch (e) {
    console.error('register error:', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
