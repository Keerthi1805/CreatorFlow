import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function RootPage() {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect('/sign-in')

  const user = await prisma.user.findUnique({ where: { clerkId } })

  // Existing user with completed profile — send to their dashboard
  if (user?.onboarded) {
    if (user.role === 'CREATOR') redirect('/creator/dashboard')
    if (user.role === 'BRAND') redirect('/brand/dashboard')
  }

  // New user or incomplete onboarding — send to onboarding
  redirect('/onboarding')
}
