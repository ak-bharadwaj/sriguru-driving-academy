import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOffers, saveOffers, Offer } from '@/lib/data/academyStore'

// Middleware helper to check Admin role
async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string } | undefined
  if (!session || user?.role !== 'ADMIN') {
    return false
  }
  return true
}

export async function GET() {
  const isAuthorized = await checkAdminAuth()
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 })
  }
  return NextResponse.json(getOffers(), { status: 200 })
}

export async function POST(request: Request) {
  const isAuthorized = await checkAdminAuth()
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 })
  }

  try {
    const offerData = await request.json()
    const { title, desc, discountPercent, promoCode, badge } = offerData

    if (!title || !desc || discountPercent === undefined || !promoCode || !badge) {
      return NextResponse.json({ error: 'Missing mandatory offer fields.' }, { status: 400 })
    }

    const currentOffers = getOffers()
    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      title,
      desc,
      discountPercent: Number(discountPercent),
      promoCode: promoCode.trim().toUpperCase(),
      active: offerData.active !== undefined ? offerData.active : true,
      badge
    }

    currentOffers.push(newOffer)
    saveOffers(currentOffers)

    return NextResponse.json({ success: true, offer: newOffer }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to create promotional offer.', details: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const isAuthorized = await checkAdminAuth()
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 })
  }

  try {
    const offerData = await request.json()
    const { id, title, desc, discountPercent, promoCode, active, badge } = offerData

    if (!id) {
      return NextResponse.json({ error: 'Missing offer ID.' }, { status: 400 })
    }

    const currentOffers = getOffers()
    const offerIndex = currentOffers.findIndex(o => o.id === id)

    if (offerIndex === -1) {
      return NextResponse.json({ error: 'Offer not found.' }, { status: 404 })
    }

    const updatedOffer = {
      ...currentOffers[offerIndex],
      ...(title && { title }),
      ...(desc && { desc }),
      ...(discountPercent !== undefined && { discountPercent: Number(discountPercent) }),
      ...(promoCode && { promoCode: promoCode.trim().toUpperCase() }),
      ...(active !== undefined && { active }),
      ...(badge && { badge })
    }

    currentOffers[offerIndex] = updatedOffer
    saveOffers(currentOffers)

    return NextResponse.json({ success: true, offer: updatedOffer }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to update promotional offer.', details: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const isAuthorized = await checkAdminAuth()
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing offer ID query parameter.' }, { status: 400 })
    }

    const currentOffers = getOffers()
    const filteredOffers = currentOffers.filter(o => o.id !== id)

    if (currentOffers.length === filteredOffers.length) {
      return NextResponse.json({ error: 'Offer not found.' }, { status: 404 })
    }

    saveOffers(filteredOffers)
    return NextResponse.json({ success: true, message: 'Offer deleted successfully.' }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to delete offer.', details: message }, { status: 500 })
  }
}
