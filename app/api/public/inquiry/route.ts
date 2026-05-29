import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, email, message } = body

    if (!name || !phone || !message) {
      return NextResponse.json({ error: 'Name, phone, and message are required' }, { status: 400 })
    }

    const inquiry = await db.inquiry.create({
      data: {
        name,
        phone,
        email,
        message
      }
    })

    revalidatePath('/admin/enquiries')

    return NextResponse.json({ success: true, inquiry }, { status: 201 })
  } catch (error) {
    console.error('Inquiry Submission Error:', error)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
