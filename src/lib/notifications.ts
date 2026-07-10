import { prisma } from './prisma'
import type { NotifType } from '@prisma/client'

export async function createNotification({ userId, type, title, message, link }: { userId: string; type: NotifType; title: string; message: string; link?: string }) {
  return prisma.notification.create({ data: { userId, type, title, message, link } })
}

export async function notifyBoth({ brandUserId, creatorUserId, type, title, message, link }: { brandUserId: string; creatorUserId: string; type: NotifType; title: string; message: string; link?: string }) {
  return prisma.notification.createMany({ data: [{ userId: brandUserId, type, title, message, link }, { userId: creatorUserId, type, title, message, link }] })
}
