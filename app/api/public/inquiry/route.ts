import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { name, phone, message } = await request.json()
    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and Phone are required parameters' }, { status: 400 })
    }

    // Save public inquiries inside the real Inquiry table
    const inquiry = await db.inquiry.create({
      data: {
        name,
        phone,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        message: message || 'Requesting information about courses'
      }
    })

    console.log(`PUBLIC INQUIRY RECEIVED: name: ${name}, phone: ${phone}, message: ${message}`)

    return NextResponse.json({ success: true, inquiry }, { status: 200 })
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Public inquiry submit error:', error)
    return NextResponse.json({ error: 'Failed to record inquiry', details: errMessage }, { status: 500 })
  }
}
