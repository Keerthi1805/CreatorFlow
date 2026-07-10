import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'
import { redirect } from 'next/navigation'

export async function getOrCreateUser() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return null
  let user = await prisma.user.findUnique({ where: { clerkId }, include: { creatorProfile: true, brandProfile: true } })
  if (!user) {
    const cu = await currentUser()
    if (!cu) return null
    const role = (cu.unsafeMetadata?.role as string) || (cu.publicMetadata?.role as string) || 'CREATOR'
    user = await prisma.user.create({
      data: { clerkId, email: cu.emailAddresses[0]?.emailAddress ?? '', name: `${cu.firstName ?? ''} ${cu.lastName ?? ''}`.trim() || 'User', avatarUrl: cu.imageUrl, role: role as any },
      include: { creatorProfile: true, brandProfile: true },
    })
  }
  return user
}

export async function requireCreator() {
  const user = await getOrCreateUser()
  if (!user) redirect('/sign-in')
  if (user.role !== 'CREATOR') redirect('/sign-in')
  if (!user.onboarded || !user.creatorProfile) redirect('/onboarding/creator')
  return { user, profile: user.creatorProfile! }
}

export async function requireBrand() {
  const user = await getOrCreateUser()
  if (!user) redirect('/sign-in')
  if (user.role !== 'BRAND') redirect('/sign-in')
  if (!user.onboarded || !user.brandProfile) redirect('/onboarding/brand')
  return { user, profile: user.brandProfile! }
}

export async function getDbUserId(): Promise<string> {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error('Unauthorized')
  const user = await prisma.user.findUnique({ where: { clerkId }, select: { id: true } })
  if (!user) throw new Error('User not found')
  return user.id
}
