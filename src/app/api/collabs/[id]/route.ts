import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDbUserId } from '@/lib/auth'
import { createNotification } from '@/lib/notifications'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getDbUserId()
    const responder = await prisma.user.findUnique({ where: { id: userId } })
    const { status, response } = await req.json()
    const collab = await prisma.collabRequest.findUnique({
      where: { id: params.id },
      include: { brand: { include: { user: true } }, creator: { include: { user: true } } },
    })
    if (!collab) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const updated = await prisma.collabRequest.update({ where: { id: params.id }, data: { status, creatorResponse: response } })
    const responderIsBrand = responder?.role === 'BRAND'
    const notifyUserId = responderIsBrand ? collab.creator.userId : collab.brand.userId
    const responderName = responderIsBrand ? collab.brand.companyName : collab.creator.businessName
    const notifType = status === 'ACCEPTED' ? 'COLLAB_ACCEPTED' : 'COLLAB_REJECTED'
    const notifLink = responderIsBrand ? '/creator/requests' : '/brand/requests'
    await createNotification({ userId: notifyUserId, type: notifType, title: status === 'ACCEPTED' ? 'Collaboration Accepted!' : 'Collaboration Declined', message: status === 'ACCEPTED' ? `${responderName} accepted the collaboration request` : `${responderName} declined.${response ? ' Reason: ' + response : ''}`, link: notifLink })
    return NextResponse.json({ data: updated })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
